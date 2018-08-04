// import miio from "miio";
import { Subject, Observable } from "rxjs";
// import { IMqttMessage } from "../../types/mqtt.model";
import MqttClientService from "../../services/mqtt.service";
import { Plugin } from "../../services/plugin";
import { share } from "rxjs/operators";

interface State {
  status: boolean;
}
export default class implements Plugin {
  state: State;
  topic: string;
  device: any;
  $health: Subject<boolean> = new Subject();
  $status: Subject<boolean> = new Subject();
  constructor(
    // private device: any,
    // private msgObserver: Subject<IMqttMessage>,
    private mqttService: MqttClientService
  ) {
    // miio
    //   .device({ address: "192.168.1.9" })
    //   .then(this.handleDevice)
    //   .catch(console.error);
  }
  registerDevice(device) {
    this.device = device;
  }

  public onStatus(): Observable<{}> {
    return this.$status.pipe(share());
  }

  handleDevice = device => {
    // console.log("Connected to", device);
    const children = device.children();
    for (const child of children) {
      if (child.matches("type:sensor")) {
        console.log(child);
        child.on("movement", () => console.log("Motion detected"));
      }
    }
    // device.togglePower().then(on => console.log("Power is now", on));
  };

  updateAccept = () => {
    const state = JSON.stringify(this.state);
    const acceptTopic = this.topic.replace("update", "accept");
    return this.mqttService.publish(acceptTopic, state);
  };
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
