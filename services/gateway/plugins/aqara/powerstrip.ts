import miio from "miio";
import { mqttService } from "../../";
import { Observable, Subject, merge, fromEvent } from "rxjs";
import { Plugin } from "../../services/plugin";
import { IMqttMessage } from "../../types/mqtt.model";
import { map, share, switchMap, delay } from "rxjs/operators";
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

  private getMqttMessage(packet: IMqttMessage) {
    const { status } = JSON.parse(packet.payload.toString());
    return status;
  }

  private handleDevice = device => {
    console.log("Connected to", device);
    this.$health.next(true);
    if (device.matches("type:power-strip")) {
      merge(
        fromEvent(device, "powerChanged").pipe(map(([status]) => ({ status }))),
        this.$("update").pipe(
          map(this.getMqttMessage),
          switchMap(
            status => device.setPower(status),
            tartgetStatus => ({ status: tartgetStatus })
          ),
          delay(10)
        )
      ).subscribe(status => {
        this.$status.next(status);
      });
    }
  };
}
