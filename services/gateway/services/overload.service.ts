import { Devices } from "../config/db";
import MqttClientService from "./mqtt.service";
import { IMqttMessage } from "../types/mqtt.model";
import { filter } from "rxjs/operators";
export default class Overload {
  constructor(private mqttService: MqttClientService) { }

  registerAllControllers(devices) {
    devices.forEach(d => this.registerController(d));
  }

  registerController(device) {
    if (device.type) {
      const msg = this.mqttService.messages.pipe(filter(this.filterId(device)));
      const updateMsg = msg.pipe(filter(this.filterAction('update')));
      const acceptMsg = msg.pipe(filter(this.filterAction('accept')));
      const Plugin = require(`../plugins/${device.type.type_name}`).default;
      new Plugin(device, updateMsg, this.mqttService);
      acceptMsg.subscribe(this.onAcceptUpdate(device));
    }
  }

  onAcceptUpdate = device => (packet: IMqttMessage) => {
    const state = JSON.parse(packet.payload.toString());
    Devices
      .findOneAndUpdate({ _id: device._id }, { state }, { new: true })
      .exec()
      .then(this.sendResponse)
      .catch(console.error);
  }

  sendResponse = (device) => {
    const topic = `devices/${device._id}/response`;
    this.mqttService.publish(topic, JSON.stringify(device.state)).subscribe();
  }

  filterId = device => (packet: IMqttMessage) => {
    const [, device_id] = packet.topic.split('/');
    return device_id === device._id.toString();
  }
  filterAction = (target: string) => (packet: IMqttMessage) => {
    const [, , action] = packet.topic.split('/');
    return action === target
  }
}

