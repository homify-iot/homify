import mqtt from "mqtt";
import { Devices } from "../config/db";
export default class MqttClient {
  constructor(url, options = {}) {
    this.url = url;
    this.options = options;
    this.connect();
    this.attachDebugHandlers();
    this.register();
  }

  connect () {
    this.client = mqtt.connect(this.url, this.options);
  }

  disconnect () {
    this.client.end();
  }

  attachDebugHandlers () {
    this.client.on("reconnect", () => {
      console.log("reconnect");
    });

    this.client.on("offline", () => {
      console.log("offline");
    });

    this.client.on("error", err => {
      console.log("iot client error", err);
    });

    this.client.on("message", this.handleMessage.bind(this));
  }

  registerDevices (devices) {
    this.devices = devices;
  }

  handleMessage (topic, message) {
    const state = JSON.parse(message);
    const [ , device_id, action ] = topic.split('/');
    if (action === 'update') {
      console.log(topic, state);
      Devices
        .findOneAndUpdate({ _id: device_id }, { state }, { new: true })
        .exec()
        .then(device => {
          this.sendResponse(device)
        })
        .catch(err => console.log(2, err))
    }
  }

  register () {
    this.client.subscribe("devices/#");
  }

  sendResponse (device) {
    const topic = `devices/${device._id}/response`;
    this.client.publish(topic, JSON.stringify(device.state));
  }
}