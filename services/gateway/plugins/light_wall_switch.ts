import { Subject } from "rxjs";
import { IMqttMessage } from "../types/mqtt.model";
import MqttClientService from "../services/mqtt.service";
import { filter, switchMap, tap } from "rxjs/operators";

interface State {
  status: boolean
}
export default class {
  send: string;
  receive: string;
  on: string;
  off: string;
  state: State;
  send_code: string
  topic: string;
  constructor(
    private device: any,
    private msgObserver: Subject<IMqttMessage>,
    private mqttService: MqttClientService) {
    if (this.device.type && this.device.type.config) {
      const { send, receive } = this.device.type.config.mqtt;
      const { on, off } = this.device.config.code;
      this.send = send;
      this.receive = receive;
      this.on = on;
      this.off = off;
    }
    this.msgObserver
      .pipe(
        tap((packet: IMqttMessage) => {
          this.state = JSON.parse(packet.payload.toString());
          this.topic = packet.topic;
          this.send_code = this.state.status ? this.on : this.off;
        }),
        switchMap(this.sendCode),
    ).subscribe();

    this.mqttService.observe(this.receive)
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
  }

  sendCode = () => {
    return this.mqttService.publish(this.send, `#${this.send_code}`)
  }

  updateAccept = () => {
    const state = JSON.stringify(this.state);
    const acceptTopic = this.topic.replace("update", "accept");
    return this.mqttService.publish(acceptTopic, state);
  }
} 
