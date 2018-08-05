import { Devices } from "../config/db";
import { mqttService } from "../";
import { Observable, from } from "rxjs";
import { switchMapTo, switchMap } from "rxjs/operators";
import { IMqttMessage } from "../types/mqtt.model";

export default class Overload {
  service: any;
  $: (action: string) => Observable<IMqttMessage>;

  constructor(private device) {
    if (this.device.type) {
      this.$ = mqttService.getStreaming(this.device._id);
      const Plugin = require(`../plugins/${this.device.type.type_name}`)
        .default;
      this.service = new Plugin(this.device);

      this.$("update")
        .pipe(switchMap(res => this.service.setState(res)))
        .subscribe(this.handleStatus);

      this.service.onHealth().subscribe(this.handleHealth);
      this.service.onStatus().subscribe(this.handleStatus);
    }
  }

  handleHealth = (status: boolean) => {
    const topic = `devices/${this.device._id}/health_check`;
    mqttService.publish(topic, JSON.stringify(status)).subscribe();
  };
  handleStatus = (state: any) => {
    console.log("handleStatus", this.device.name, state);
    const topic = `devices/${this.device._id}/response`;
    mqttService
      .publish(topic, JSON.stringify(state))
      .pipe(
        switchMapTo(
          from(
            Devices.findOneAndUpdate(
              { _id: this.device._id },
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
