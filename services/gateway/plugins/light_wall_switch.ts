import { Observable, BehaviorSubject } from "rxjs";
import { IMqttMessage } from "../types/mqtt.model";
import { filter, switchMap, tap } from "rxjs/operators";
import { Plugin } from "../services/plugin";
import { mqttService } from "../";

interface State {
  status: boolean;
}
export default class implements Plugin {
  health: BehaviorSubject<boolean> = new BehaviorSubject(null);
  status: BehaviorSubject<boolean> = new BehaviorSubject(false);
  $: (action: string) => Observable<IMqttMessage>;
  device: any;
  send: string;
  receive: string;
  on: string;
  off: string;
  state: State;
  send_code: string;
  topic: string;
  constructor() {}

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
    this.$ = mqttService.getStreaming(device);

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
      .pipe(
        filter(this.filterReceiveCode),
        switchMap(this.updateAccept)
      )
      .subscribe();
  }
  filterReceiveCode = (packet: IMqttMessage) => {
    const msg = JSON.parse(packet.payload.toString()).RfCode;
    const receive_code = msg.replace("#", "").toLowerCase();
    return this.send_code === receive_code;
  };

  sendCode = () => {
    return mqttService.publish(this.send, `#${this.send_code}`);
  };

  updateAccept = () => {
    const state = JSON.stringify(this.state);
    const acceptTopic = this.topic.replace("update", "accept");
    return mqttService.publish(acceptTopic, state);
  };
}
