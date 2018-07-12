import ControlService from "./control.service";
import { Devices } from "../config/db";

export default class Overload {
  constructor() {
    this.controllers = {};
  }

  registerAllControllers (devices) {
    devices.forEach(d => this.registerController(d));
  }

  registerController (device) {
    const service = new ControlService(device);
    this.controllers[ device._id ] = {
      device, service
    };
    if (device.type) {
      const Plugin = require(`../plugins/${device.type.type_name}`).default;
      new Plugin(device, service);
      service.on("accept", (state) => {
        Devices
          .findOneAndUpdate({ _id: device._id }, { state }, { new: true })
          .exec()
          .then(device => {
            this.sendResponse(device);
          })
          .catch(err => console.log(2, err));
      });
    }
  }

  sendResponse (device) {
    const topic = `devices/${device._id}/response`;
    this.client.publish(topic, JSON.stringify(device.state));
  }

  attachClient (client) {
    this.client = client;
    client.on("message", (topic, message) => {
      const state = JSON.parse(message);
      const [ , device_id, action ] = topic.split("/");
      this.controllers[ device_id ].service.emit(action, state);
    });
  }
}