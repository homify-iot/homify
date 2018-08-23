import { connect, IClientSubscribeOptions, ISubscriptionGrant } from "mqtt";
import {
  BehaviorSubject,
  merge,
  Observable,
  Observer,
  Subject,
  Subscription,
  Unsubscribable,
  using,
} from "rxjs";
import { filter, publish, publishReplay, refCount } from "rxjs/operators";
import {
  IMqttClient,
  IMqttMessage,
  IMqttServiceOptions,
  IOnConnectEvent,
  IOnErrorEvent,
  IPublishOptions,
  MqttConnectionState,
} from "@/types/mqtt.model";
export default class MqttClientService {

  public get clientId() {
    return this._clientId;
  }
  public observables: { [filter: string]: Observable<IMqttMessage> } = {};

  public state: BehaviorSubject<MqttConnectionState> = new BehaviorSubject(
    MqttConnectionState.CLOSED,
  );
  public messages: Subject<IMqttMessage> = new Subject<IMqttMessage>();
  private _clientId = this._generateClientId();
  private _keepalive = 10;
  private _connectTimeout = 10000;
  private _reconnectPeriod = 10000;
  private _url: string | undefined = undefined;

  constructor(private client?: IMqttClient) {
    this.connect();
    this.state.subscribe();
  }

  public connect(options?: IMqttServiceOptions, client?: IMqttClient) {
    options = options || {};
    const protocol = options.protocol || "ws";
    const hostname = options.hostname || "192.168.1.2";
    const port = options.port || 9001;
    const path = options.path || "";
    this._url = `${protocol}://${hostname}:${port}/${path}`;
    const mergedOptions = Object.assign(
      {
        clientId: this._clientId,
        keepalive: this._keepalive,
        reconnectPeriod: this._reconnectPeriod,
        connectTimeout: this._connectTimeout,
      },
      options,
    );
    this.state.next(MqttConnectionState.CONNECTING);
    if (this.client) {
      this.client.end(true);
    }

    if (!client) {
      this.client = connect(
        this._url,
        mergedOptions,
      ) as IMqttClient;
    } else {
      this.client = client;
    }
    this._clientId = mergedOptions.clientId;
    this.client.on("connect", this._handleOnConnect);
    this.client.on("close", this._handleOnClose);
    this.client.on("error", this._handleOnError);
    this.client.stream.on("error", this._handleOnError);
    this.client.on("reconnect", this._handleOnReconnect);
    this.client.on("message", this._handleOnMessage);
  }

  public disconnect(force = true) {
    if (!this.client) {
      throw new Error("mqtt client not connected");
    }
    this.client.end(force);
  }

  public observeRetained(
    filterString: string,
    opts: IClientSubscribeOptions = { qos: 1 },
  ): Observable<IMqttMessage> {
    return this._generalObserve(filterString, () => publishReplay(1), opts);
  }
  public observe(
    filterString: string,
    opts: IClientSubscribeOptions = { qos: 1 },
  ): Observable<IMqttMessage> {
    return this._generalObserve(filterString, () => publish(), opts);
  }
  public publish(
    topic: string,
    message: any,
    options?: IPublishOptions,
  ): Observable<void> {
    if (!this.client) {
      throw new Error("mqtt client not connected");
    }
    const source = Observable.create((obs: Observer<void>) => {
      this.client.publish(topic, message, options, (err: Error) => {
        if (err) {
          obs.error(err);
        } else {
          obs.next(null);
          obs.complete();
        }
      });
    });
    return source;
  }
  public unsafePublish(
    topic: string,
    message: any,
    options?: IPublishOptions,
  ): void {
    if (!this.client) {
      throw new Error("mqtt client not connected");
    }
    this.client.publish(topic, message, options, (err: Error) => {
      if (err) {
        throw err;
      }
    });
  }
  public filterMatchesTopic(filterString: string, topic: string): boolean {
    if (filterString[0] === "#" && topic[0] === "$") {
      return false;
    }
    // Preparation: split and reverse on '/'. The JavaScript split function is sane.
    const fs = (filterString || "").split("/").reverse();
    const ts = (topic || "").split("/").reverse();
    // This function is tail recursive and compares both arrays one element at a time.
    const match = (): boolean => {
      // Cutting of the last element of both the filter and the topic using pop().
      const f = fs.pop();
      const t = ts.pop();
      switch (f) {
        // In case the filter level is '#', this is a match no matter whether
        // the topic is undefined on this level or not ('#' matches parent element as well!).
        case "#":
          return true;
        // In case the filter level is '+', we shall dive into the recursion only if t is not undefined.
        case "+":
          return t ? match() : false;
        // In all other cases the filter level must match the topic level,
        // both must be defined and the filter tail must match the topic
        // tail (which is determined by the recursive call of match()).
        default:
          return f === t && (f === undefined ? true : match());
      }
    };
    return match();
  }

  public getStreaming = (id: string) => (
    action: string,
  ): Observable<IMqttMessage> => {
    return this.messages.pipe(
      filter(this._filterId(id)),
      filter(this._filterAction(action)),
    );
  }
  private _generalObserve(
    filterString: string,
    publishFn: () => any,
    opts: IClientSubscribeOptions,
  ): Observable<IMqttMessage> {
    if (!this.client) {
      throw new Error("mqtt client not connected");
    }
    if (!this.observables[filterString]) {
      const rejected: Subject<IMqttMessage> = new Subject();
      this.observables[filterString] = using(
        // resourceFactory: Do the actual ref-counting MQTT subscription.
        // refcount is decreased on unsubscribe.
        () => {
          const subscription: Subscription = new Subscription();
          this.client.subscribe(
            filterString,
            opts,
            (_err, granted: ISubscriptionGrant[]) => {
              if (granted) {
                // granted can be undefined when an error occurs when the client is disconnecting
                granted.forEach((_granted: ISubscriptionGrant) => {
                  if (_granted.qos === 128) {
                    delete this.observables[_granted.topic];
                    this.client.unsubscribe(_granted.topic);
                    rejected.error(
                      `subscription for '${_granted.topic}' rejected!`,
                    );
                  }
                });
              }
            },
          );
          subscription.add(() => {
            delete this.observables[filterString];
            this.client.unsubscribe(filterString);
          });
          return subscription;
        },
        // observableFactory: Create the observable that is consumed from.
        // This part is not executed until the Observable returned by
        // `observe` gets actually subscribed.
        (_subscription: Unsubscribable | void) => merge(rejected, this.messages),
      ).pipe(
        filter((msg: IMqttMessage) =>
          this.filterMatchesTopic(filterString, msg.topic),
        ),
        publishFn(),
        refCount(),
      ) as Observable<IMqttMessage>;
    }
    return this.observables[filterString];
  }

  private _handleOnClose = () => {
    this.state.next(MqttConnectionState.CLOSED);
  }

  private _handleOnConnect = (_e: IOnConnectEvent) => {
    Object.keys(this.observables).forEach((filterString: string) => {
      this.client.subscribe(filterString);
    });
    this.state.next(MqttConnectionState.CONNECTED);
  }

  private _handleOnReconnect = () => {
    Object.keys(this.observables).forEach((filterString: string) => {
      this.client.subscribe(filterString);
    });
    this.state.next(MqttConnectionState.CONNECTING);
  }

  private _handleOnError = (e: IOnErrorEvent) => {
    console.error(e);
  }

  private _handleOnMessage = (_topic: string, _msg, packet: IMqttMessage) => {
    if (packet.cmd === "publish") {
      this.messages.next(packet);
    }
  }

  private _generateClientId() {
    return (
      "gateway-" +
      Math.random()
        .toString(36)
        .substr(2, 19)
    );
  }

  private _filterId = (id: string) => (packet: IMqttMessage) => {
    const [, deviceId] = packet.topic.split("/");
    return !id || deviceId === id.toString();
  }
  private _filterAction = (target: string) => (packet: IMqttMessage) => {
    const [, , action] = packet.topic.split("/");
    return action === target;
  }
}
