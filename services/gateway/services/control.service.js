import { EventEmitter } from "events";

export default class ControlService extends EventEmitter {
  constructor(device, client) {
    super();
    this.device = device;
    this.mqttClient = client;
  }
}
