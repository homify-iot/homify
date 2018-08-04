import miio from "miio";
import { mqttService } from "../../";
import { Observable, Subject, fromEvent, from } from "rxjs";
import { Plugin } from "../../services/plugin";
import { IMqttMessage } from "../../types/mqtt.model";
import { map, share } from "rxjs/operators";
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

  public onStatus(): Observable<{}> {
    return this.$status.pipe(share());
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
          })
        )
        .subscribe(status => {
          from(device.setPower(status)).subscribe();
          // this.$status.next({ status });
          // this.$status.next(state);
          // from(device.power())
          //   .pipe(map(status => ({ status })))
          //   .subscribe(status => {
          //     console.log(111, status);
          //     this.$status.next(status);
          //   });
        });
      // from(device.power())
      //   .pipe(map(status => ({ status })))
      //   .subscribe(status => this.$status.next(status));

      fromEvent(device, "powerChanged")
        .pipe(map(([status]) => ({ status })))
        .subscribe(res => {
          console.log("powerChanged", res);
          this.$status.next(res);
        });
    }
  };
}
