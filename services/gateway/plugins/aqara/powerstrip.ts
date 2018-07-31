import miio from "miio";
// import { IMqttMessage } from "../../types/mqtt.model";
import { mqttService } from "../../";
import { BehaviorSubject, Observable } from "rxjs";
import { Plugin } from "../../services/plugin";
import { IMqttMessage } from "../../types/mqtt.model";
export default class implements Plugin {
  topic: string;
  device: any;
  onlineStatus: BehaviorSubject<boolean> = new BehaviorSubject(false);
  status: BehaviorSubject<boolean> = new BehaviorSubject(false);
  constructor() {}
  registerDevice(device) {
    this.device = device;
    miio
      .device({
        address: this.device.config.address
      })
      .then(this.handleDevice)
      .catch(err => {
        this.onlineStatus.next(false);
        console.error(err);
      });
    const updateObserver: Observable<IMqttMessage> = mqttService.getStreaming(
      device,
      "update"
    );
    updateObserver.subscribe((packet: IMqttMessage) => {
      const state = JSON.parse(packet.payload.toString());
      console.log(state);
    });
  }
  handleDevice = device => {
    console.log("Connected to", device);
    this.onlineStatus.next(true);
    if (device.matches("type:power-strip")) {
      // device.power().then(power => this.status.next(power));
      // device.setPower(false).then(console.log);
      device.on("powerChanged", power => this.status.next(power));
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
