export default class {
  public service;
  public device;
  attachPlugin(service) {
    this.service = service;
    this.device = service.device;
    this.service.on("update", this.getUpdate.bind(this));
  }

  getUpdate(state) {
    if (this.device.type && this.device.type.config) {
      const { send, receive } = this.device.type.config.mqtt;
      const { on, off } = this.device.config.code;
      const send_code = state.status ? on : off;
      this.service.mqttClient.publish(send, `#${send_code}`);
      this.service.mqttClient.on("message", this.handleMessage(send_code, receive, state));
    }
  }

  handleMessage(send_code, receive, state) {
    return (topic, message) => {
      if (topic === receive) {
        if (send_code === this.getCode(message)) {
          this.updateAccept(state);
        }
      }
    };
  }

  getCode(message) {
    const msg = JSON.parse(message.toString()).RfCode;
    return msg.replace("#", "").toLowerCase();
  }

  updateAccept(state) {
    this.service.emit("accept", state);
  }
} 
