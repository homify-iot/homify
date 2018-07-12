import { EventEmitter } from "events";

export default class ControlService extends EventEmitter {
  constructor(device) {
    super();
    this.device = device;
  }
}
