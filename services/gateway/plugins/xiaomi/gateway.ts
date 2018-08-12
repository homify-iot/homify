import miio from "miio";
import { Observable, Subject } from "rxjs";
import { share } from "rxjs/operators";
export default class {
  device$: any;
  private status$: Subject<{ action, device, message }> = new Subject();

  constructor(private device) {
    miio
      .device({
        address: device.config.address
      })
      .then(this._handleDevice)
      .catch(err => {
        console.error(err);
        this.status$.next({ action: "health_check", device: this.device, message: false });
      });
    const devices = miio.devices({
      cacheTime: 300 // 5 minutes. Default is 1800 seconds (30 minutes)
    });

    devices.on('available', device => {
      console.log("2available", device);
    });

    devices.on('unavailable', device => {
      console.log('2unavailable', device);
      // Device is no longer available and is destroyed
    });
  }

  public onStatus(): Observable<{}> {
    return this.status$.pipe(share());
  }

  private _handleDevice = device$ => {
    this.device$ = device$;
    // console.log("Connected to", device$);
    this.status$.next({ action: "health_check", device: this.device, message: true });
    // this.device.config.children.forEach(this._handleChildren)
    // if (device$.matches("cap:children")) {
    //   const children = device$.children();
    //   for (const child of children) {
    //     // console.log(child);

    //     if (child.matches("type:wall-switch")) {
    //       for (const c of child.children()) {
    //         console.log(123, c);
    //         // child
    //         //   .child("0")
    //         //   .power()
    //         //   .then(res => console.log(res));
    //       }
    //     }
    //   }
    // };
  }

  // private _handleChildren = children => {
  //   // console.log(children);
  //   if (this.device$.matches("cap:children")) {
  //     const children = this.device$.children();
  //     for (const child of children) {
  //       // console.log(123, child);
  //     }
  //   }
  // }
}
