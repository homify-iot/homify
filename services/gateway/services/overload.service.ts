import { Devices } from "../config/db";
import { mqttService } from "../";
import { from } from "rxjs";
import { switchMapTo } from "rxjs/operators";

export default class Overload {
  service: any;
  constructor(device) {
    if (device.type) {
      const Plugin = require(`../plugins/${device.type.type_name}`).default;
      this.service = new Plugin();
      this.service.registerDevice(device);
      this.service.$health.subscribe(this.handleHealth(device));
      this.service.onStatus().subscribe(this.handleStatus(device));
      console.log(device._id);
    }
  }

  handleHealth = device => (status: boolean) => {
    const topic = `devices/${device._id}/health_check`;
    mqttService.publish(topic, JSON.stringify(status)).subscribe();
  };
  handleStatus = device => (state: any) => {
    console.log("handleStatus", device.name, state);
    const topic = `devices/${device._id}/response`;
    mqttService
      .publish(topic, JSON.stringify(state))
      .pipe(
        switchMapTo(
          from(
            Devices.findOneAndUpdate(
              { _id: device._id },
              { state },
              { new: true }
            ).exec()
          )
        )
      )
      .subscribe();
  };
}

// const registerController = device => {
//   if (device.type) {
//     const Plugin = require(`../plugins/${device.type.type_name}`).default;
//     const service = new Plugin();
//     service.registerDevice(device);
//     service.$health.subscribe(handleHealth(device));
//     service.onStatus().subscribe(handleStatus(device));
//   }
// };
