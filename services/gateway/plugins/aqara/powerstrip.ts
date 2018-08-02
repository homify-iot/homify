import miio from "miio";
import { mqttService } from "../../";
import { Observable, Subject, fromEvent, from } from "rxjs";
import { Plugin } from "../../services/plugin";
import { IMqttMessage } from "../../types/mqtt.model";
import { map, switchMap } from "rxjs/operators";
export default class implements Plugin {
  device: any;
  topic: string;
  $health: Subject<boolean> = new Subject();
  $status: Subject<any> = new Subject();
  $: (action: string) => Observable<IMqttMessage>;

  constructor() {}
  registerDevice(device) {
    this.device = device;
    this.$ = mqttService.getStreaming(device._id);
    miio
      .device({
        address: device.config.address
      })
      .then(this.handleDevice)
      .catch(err => {
        this.$health.next(false);
        console.error(err);
      });
  }

  private handleDevice = device => {
    console.log("Connected to", device);
    this.$health.next(true);
    if (device.matches("type:power-strip")) {
      this.$("update")
        .pipe(
          map((packet: IMqttMessage) => {
            const { status } = JSON.parse(packet.payload.toString());
            return status;
          }),
          switchMap((status: boolean) => from(device.setPower(status))),
          map(status => ({ status: !status }))
        )
        .subscribe(res => this.$status.next(res));
      // from(device.power())
      //   .pipe(map(status => ({ status })))
      //   .subscribe(this.$status);

      fromEvent(device, "powerChanged")
        .pipe(map(([status]) => ({ status })))
        .subscribe(res => this.$status.next(res));
    }
  };
}
