import { Devices } from "../config/db";
import { mqttService } from "../";
import { Observable, from, merge } from "rxjs";
import { switchMapTo, switchMap } from "rxjs/operators";
import { IMqttMessage } from "../types/mqtt.model";
import * as R from "ramda";

export default class Overload {
  service: any;
  $: (action: string) => Observable<IMqttMessage>;

  constructor(private device) {
    try {
      const { platform, type_name } = this.device.type;
      if (type_name === "gateway") return;
      const moduleName = `@/plugins/${platform}/${type_name}`;
      const Plugin = require(moduleName).default;
      this.service = new Plugin(this.device);
      this.$ = mqttService.getStreaming(this.device._id);
      merge(
        this.$("update")
          .pipe(switchMap(target => this.service.setState(target))),
        this.service.onStatus()
      ).subscribe(this.handleChanges);

    } catch (e) {
      console.log(this.device.name, e);
      this.handleChanges({ action: "health_check", device: this.device, message: false })
    }
  }

  handleChanges = ({ action, device, message }) => {
    console.log(action, device.name, message);
    const topic = `devices/${this.device._id}/${action}`;
    const key = R.cond([
      [R.equals("health_check"), R.always("online")],
      [R.equals("response"), R.always("state")]
    ])(action);
    mqttService
      .publish(topic, JSON.stringify(message))
      .pipe(
        switchMapTo(
          from(
            Devices.findOneAndUpdate(
              { _id: this.device._id },
              { [key]: message },
              { new: true }
            ).exec()
          )
        )
      )
      .subscribe();
  };
}
