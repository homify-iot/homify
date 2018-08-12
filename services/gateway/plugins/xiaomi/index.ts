import miio from "miio";
import { Observable, Subject } from "rxjs";
import { share } from "rxjs/operators";
export default class {
  device$: any;
  private status$: Subject<{ action, device, message }> = new Subject();

  constructor(private device) {
    const devices = miio.devices({
      cacheTime: 300 // 5 minutes. Default is 1800 seconds (30 minutes)
    });

    devices.on('available', device$ => {
      console.log("available", device$);
      this.status$.next({ action: "health_check", device: this.device, message: true });
    });

    devices.on('unavailable', device$ => {
      console.log('unavailable', device$);
      this.status$.next({ action: "health_check", device: this.device, message: true });

      // Device is no longer available and is destroyed
    });
  }
  public onStatus(): Observable<{}> {
    return this.status$.pipe(share());
  }

}
