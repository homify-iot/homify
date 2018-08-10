import miio from "miio";
import { Observable, Subject, of, fromEvent } from "rxjs";
import { IMqttMessage } from "@/types/mqtt.model";
import { map, share, switchMap, delay } from "rxjs/operators";
export default class {
  device$: any;
  // private health$: Subject<{ device, state }> = new Subject();
  private status$: Subject<{ action, device, message }> = new Subject();

  constructor(private device) {
    miio
      .device({
        address: this.device.config.address
      })
      .then(this._handleDevice)
      .catch(err => {
        console.error(err);
        this.status$.next({ action: "health_check", device: this.device, message: false });
      });
  }

  public setState(target): Observable<{}> {
    return of(target).pipe(
      map(this._getMqttMessage),
      switchMap(
        status => this.device$.setPower(status),
        tartgetStatus => ({ action: "response", device: this.device, message: { status: tartgetStatus } })
      ),
      delay(10)
    );
  }

  public onStatus(): Observable<{}> {
    return this.status$.pipe(share());
  }

  private _getMqttMessage(packet: IMqttMessage) {
    const { status } = JSON.parse(packet.payload.toString());
    return status;
  }

  private _handleDevice = device => {
    this.device$ = device;
    console.log("Connected to", device);
    this.status$.next({ action: "health_check", device: this.device, message: true });
    if (device.matches("type:power-strip")) {
      fromEvent(device, "powerChanged")
        .pipe(map(([status]) => ({ action: "response", device: this.device, message: { status } })))
        .subscribe(this.status$);
    }
  };
}
