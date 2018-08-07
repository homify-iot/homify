import miio from "miio";
import { Observable, Subject, of, fromEvent } from "rxjs";
import { IMqttMessage } from "@/types/mqtt.model";
import { map, share, switchMap, delay } from "rxjs/operators";
export default class {
  device: any;
  private health$: Subject<boolean> = new Subject();
  private status$: Subject<any> = new Subject();

  constructor(device) {
    miio
      .device({
        address: device.config.address
      })
      .then(this._handleDevice)
      .catch(err => {
        console.error(err);
        this.health$.next(false);
      });
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
    this.health$.next(true);
    if (device.matches("type:power-strip")) {
      fromEvent(device, "powerChanged")
        .pipe(map(([status]) => ({ status })))
        .subscribe(status => {
          this.status$.next(status);
        });
    }
  };
}
