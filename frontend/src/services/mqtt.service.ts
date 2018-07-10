import mqtt from "mqtt";
import store from "@/store";
import { UPDATE_DEVICE_STATE } from "@/store/event-types"
export default class MqttClient {
  client: any;
  constructor(private url, private options = {}) {
    this.connect();
    this.attachDebugHandlers();
  }
  connect() {
    this.client = mqtt.connect(this.url, this.options);
  }
  disconnect() {
    this.client.end();
  }
  attachDebugHandlers() {
    this.client.on("reconnect", () => {
      console.log("reconnect");
    });

    this.client.on("offline", () => {
      console.log("offline");
    });

    this.client.on("error", err => {
      console.log("iot client error", err);
    });

    this.client.on("message", this.handleMessage);
  }
  handleMessage(topic, message) {
    const state = JSON.parse(message);
    const [{ }, { }, device_id, action] = topic.split('/');
    if (action === 'response') {
      const device = {
        _id: device_id,
        state
      }
      store.dispatch(UPDATE_DEVICE_STATE, device)
    }
  }
  register(device) {
    const topic = `devices/${device.type.type}/${device._id}/response`;
    this.client.subscribe(topic);
  }
  update(device) {
    const topic = `devices/${device.type.type}/${device._id}/update`;
    const target = Object.assign({}, device.state, { status: !device.state });
    this.client.publish(topic, JSON.stringify(target));
  }
}