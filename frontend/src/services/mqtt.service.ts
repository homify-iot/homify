import mqtt from "mqtt";
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

    this.client.on("message", (topic, message) => {
      console.log("new message", topic, JSON.parse(message.toString()));
    });
  }
  register(deviceId) {
    const topic = `devices/${deviceId}/response`;
    this.client.subscribe(topic);
  }
  update(deviceId, stateObject) {
    const topic = `devices/${deviceId}/update`;
    this.client.publish(topic, stateObject);
  }
}