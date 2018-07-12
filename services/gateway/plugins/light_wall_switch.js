export default class {
  constructor(device, service) {
    this.device = device;
    this.service = service;
    service.on("update", this.getUpdate.bind(this));
  }

  getUpdate (state) {
    console.log(state);
    setTimeout(() => {
      this.updateAccept(state);
    }, 2000);
  }

  updateAccept (state) {
    this.service.emit("accept", state);
  }
} 