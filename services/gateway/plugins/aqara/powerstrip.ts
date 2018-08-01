import miio from "miio";
// import { IMqttMessage } from "../../types/mqtt.model";
import { mqttService } from "../../";
import { Observable, BehaviorSubject, from } from "rxjs";
import { Plugin } from "../../services/plugin";
import { IMqttMessage } from "../../types/mqtt.model";
import { switchMapTo, map, tap } from "rxjs/operators";
export default class implements Plugin {
  device: any;
  topic: string;
  health: BehaviorSubject<boolean> = new BehaviorSubject(false);
  status: BehaviorSubject<any> = new BehaviorSubject(null);
  $: (action: string) => Observable<IMqttMessage>;

  constructor() {}
  registerDevice(device) {
    this.device = device;
    miio
      .device({
        address: device.config.address
      })
      .then(this.handleDevice)
      .catch(err => {
        this.health.next(false);
        console.error(err);
      });
    this.$ = mqttService.getStreaming(device);
  }

  private handleDevice = device => {
    console.log("Connected to", device);
    this.health.next(true);
    if (device.matches("type:power-strip")) {
      this.$("update").subscribe((packet: IMqttMessage) => {
        const state = JSON.parse(packet.payload.toString());
        console.log(55, state);
      });
      this.$("get")
        .pipe(
          tap(res => console.log(13213, res)),
          switchMapTo(from(device.power())),
          map(power => ({ status: power }))
        )
        .subscribe(this.status);
      // from(device.power()).subscribe(res => console.log(123, res));
      // device.setPower(false).then(console.log);
      device.on("powerChanged", power => this.status.next({ status: power }));
    }
    // const children = device.children();
    // for (const child of children) {
    //   if (child.matches("type:sensor")) {
    //     console.log(child);
    //     child.on("movement", () => console.log("Motion detected"));
    //   }
    // }
    // device.togglePower().then(on => console.log("Power is now", on));
  };

  // sendOnlineStatus(status: boolean) {
  //   const state = JSON.stringify({online: status});
  //   this.mqttService.publish(acceptTopic, state)
  // }

  // updateAccept = () => {
  //   const state = JSON.stringify(this.state);
  //   const acceptTopic = this.topic.replace("update", "accept");
  //   return this.mqttService.publish(acceptTopic, state);
  // };
}

// devices.on("available", device => {
//   console.log(device);
//   if (device.matches("placeholder")) {
//     console.log(2222);
//     // This device is either missing a token or could not be connected to
//   } else {
//     console.log(111);
//     // Do something useful with device
//   }
//   console.log(232);
// });

// devices.on("unavailable", device => {
//   console.log(device);
//   // Device is no longer available and is destroyed
// });
