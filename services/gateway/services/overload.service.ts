import { Devices } from "../config/db";
import { mqttService } from "../";
import { from } from "rxjs";
import { switchMapTo } from "rxjs/operators";

const registerController = device => {
  if (device.type) {
    const Plugin = require(`../plugins/${device.type.type_name}`).default;
    const service = new Plugin();
    service.registerDevice(device);
    service.$health.subscribe(handleHealth(device));
    service.$status.subscribe(handleStatus(device));
  }
};

const handleHealth = device => (status: boolean) => {
  const topic = `devices/${device._id}/health_check`;
  mqttService.publish(topic, JSON.stringify(status)).subscribe();
};
const handleStatus = device => (state: any) => {
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

export const registerAllControllers = devices => {
  devices.forEach(d => registerController(d));
};
