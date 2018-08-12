import miio from "miio";
import { Observable, Subject, of, fromEvent } from "rxjs";
import { IMqttMessage } from "@/types/mqtt.model";
import { map, share, switchMap, delay } from "rxjs/operators";
export default class {
  device$: any;
  private status$: Subject<{ action, device, message }> = new Subject();

  constructor(private device) {
    const devices = miio.devices({
      cacheTime: 300 // 5 minutes. Default is 1800 seconds (30 minutes)
    });

    devices.on('available', device$ => {
      console.log("1available", device$);
      this.status$.next({ action: "health_check", device: this.device, message: true });
    });

    devices.on('unavailable', device$ => {
      console.log('1unavailable', device$);
      this.status$.next({ action: "health_check", device: this.device, message: true });

      // Device is no longer available and is destroyed
    });
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
