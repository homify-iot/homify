import miio from "miio";
import { Observable, Subject, of } from "rxjs";
import { IMqttMessage } from "@/types/mqtt.model";
import { map, share, switchMap, delay } from "rxjs/operators";
export default class {
  device: any;
  private health$: Subject<boolean> = new Subject();
  private status$: Subject<any> = new Subject();

  constructor(device) {
    try {
      miio
        .device({
          address: device.platform.config.address
        })
        .then(this._handleDevice)
        .catch(console.log);
    } catch (e) {
      console.log(e);
      this.health$.next(false);
    }
  }

  public setState(target): Observable<{}> {
    return of(target).pipe(
      map(this._getMqttMessage),
      switchMap(
        status => this.device.setPower(status),
        tartgetStatus => ({ status: tartgetStatus })
      ),
      delay(10)
    );
  }

  public onStatus(): Observable<{}> {
    return this.status$.pipe(share());
  }

  public onHealth(): Observable<{}> {
    return this.health$.pipe(share());
  }
  private _getMqttMessage(packet: IMqttMessage) {
    const { status } = JSON.parse(packet.payload.toString());
    return status;
  }

  private _handleDevice = device => {
    this.device = device;
    console.log("Connected to", device);
    if (device.matches("cap:children")) {
      const children = device.children();
      for (const child of children) {
        if (child.matches("type:wall-switch")) {
          child
            .child("0")
            .power()
            .then(res => console.log(res));
          this.health$.next(true);
        }
      }
    }
  };
}
