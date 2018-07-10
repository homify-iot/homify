import mqtt from "mqtt";
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

  handleMessage (topic, message) {
    const state = JSON.parse(message);
    const [ category, type, device_id, action ] = topic.split('/');
    console.log(topic, state);
    if (action === 'update') {
      if (type === 'Lightbulb') {
        //todo: write to db
        this.sendResponse({ _id: device_id, type: { type }, state });
      }
    }
  }

  register () {
    this.client.subscribe("devices/#");
  }

  sendResponse (device) {
    const topic = `devices/${device.type.type}/${device._id}/response`;
    this.client.publish(topic, JSON.stringify(device.state));
  }
}