import { Observable, Subject } from "rxjs";
import { IMqttMessage } from "../types/mqtt.model";
import { filter, switchMap, tap, share } from "rxjs/operators";
import { Plugin } from "../services/plugin";
import { mqttService } from "../";

interface State {
  status: boolean;
}
export default class extends Plugin {
  health$: Subject<boolean> = new Subject();
  status$: Subject<any> = new Subject();
  $: (action: string) => Observable<IMqttMessage>;
  device: any;
  send: string;
  receive: string;
  on: string;
  off: string;
  state: State;
  send_code: string;
  topic: string;
  constructor() {
    super();
  }

  registerDevice(device) {
    this.device = device;
    if (this.device.type && this.device.type.config) {
      const { send, receive } = this.device.type.config.mqtt;
      const { on, off } = this.device.config.code;
      this.send = send;
      this.receive = receive;
      this.on = on;
      this.off = off;
    }
    this.$ = mqttService.getStreaming(device._id);

    this.$("update")
      .pipe(
        tap((packet: IMqttMessage) => {
          this.state = JSON.parse(packet.payload.toString());
          this.topic = packet.topic;
          this.send_code = this.state.status ? this.on : this.off;
        }),
        switchMap(this.sendCode)
      )
      .subscribe();

    mqttService
      .observe(this.receive)
      .pipe(filter(this.filterReceiveCode))
      .subscribe(() => this.status$.next(this.state));
  }

  public onStatus(): Observable<{}> {
    return this.status$.pipe(share());
  }
  public onHealth(): Observable<{}> {
    return this.health$.pipe(share());
  }
  filterReceiveCode = (packet: IMqttMessage) => {
    const msg = JSON.parse(packet.payload.toString()).RfCode;
    const receive_code = msg.replace("#", "").toLowerCase();
    return this.send_code === receive_code;
  };

  sendCode = () => {
    return mqttService.publish(this.send, `#${this.send_code}`);
  };
}
