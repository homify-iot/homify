import { Devices } from "../config/db";
import { IMqttMessage } from "../types/mqtt.model";
import { mqttService } from "../";

const registerController = device => {
  if (device.type) {
    const Plugin = require(`../plugins/${device.type.type_name}`).default;
    const service = new Plugin();
    service.registerDevice(device);
    service.health.subscribe(handleHealth(device));
    service.status.subscribe(handleStatus(device));
    mqttService
      .getStreaming(device)("accept")
      .subscribe(onAcceptUpdate(device));
  }
};

const handleHealth = device => (status: boolean) => {
  const topic = `devices/${device._id}/online`;
  mqttService.publish(topic, JSON.stringify(status)).subscribe();
};
const handleStatus = device => (status: any) => {
  console.log("handleStatus", status);
  const topic = `devices/${device._id}/response`;
  mqttService.publish(topic, JSON.stringify(status)).subscribe();
};
const onAcceptUpdate = device => (packet: IMqttMessage) => {
  const state = JSON.parse(packet.payload.toString());
  Devices.findOneAndUpdate({ _id: device._id }, { state }, { new: true })
    .exec()
    .then(sendResponse)
    .catch(console.error);
};

const sendResponse = device => {
  const topic = `devices/${device._id}/response`;
  mqttService.publish(topic, JSON.stringify(device.state)).subscribe();
};

export const registerAllControllers = devices => {
  devices.forEach(d => registerController(d));
};
