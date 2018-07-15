import ControlService from "./control.service";
import { Devices } from "../config/db";

export default class Overload {
  public controllers = {};
  public client;
  public Plugin;

  registerAllControllers(devices) {
    devices.forEach(d => this.registerController(d));
  }

  registerController(device) {
    const service = new ControlService(device, this.client);
    this.controllers[device._id] = service;
    this.responseHandler({ service });
  }

  responseHandler({ service }) {
    if (service.device.type) {
      this.Plugin = new (require(`../plugins/${service.device.type.type_name}`).default);
      this.Plugin.attachPlugin(service);
      service.on("accept", (state) => {
        Devices
          .findOneAndUpdate({ _id: service.device._id }, { state }, { new: true })
          .exec()
          .then(device => {
            this.sendResponse(device);
          })
          .catch(console.error);
      });
    }
  }

  sendResponse(device) {
    const topic = `devices/${device._id}/response`;
    this.client.publish(topic, JSON.stringify(device.state));
  }

  attachClient(client) {
    this.client = client;
    client.on("message", (topic, message) => {
      const [...args] = topic.split("/");
      if (args[0] === "devices") {
        const state = JSON.parse(message);
        const device_id = args[1];
        const action = args[2];
        this.controllers[device_id].emit(action, state);
      }
    });
  }
}