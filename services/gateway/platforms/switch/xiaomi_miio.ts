import miio from "miio";
import { homify } from "@/index";
import SwithcDevice from "./_switch"
import { fromEvent, from } from "rxjs";
import { map, delay } from "rxjs/operators";

export const setup_platform = (config) => {
  miio.device({ address: config.host })
    .then(device => {
      console.log('Connected to', device);
      const component = new PowerStrip(device, config);
      homify.add_component(component);
    })
    .catch(console.log);
}

class PowerStrip extends SwithcDevice {
  constructor(private device, private config) {
    super();
    this.entity_id = device.id;
    this.name = "PowerStrip " + device.id;
    this.image = "https://fb1-cw.lnwfile.com/_/cw/_raw/nl/tn/x8.jpg";
    this.available = true;
    this.getCurrentState();
    this.listenChanges();
  }

  async getCurrentState() {
    const result = await this.device.power();
    this.state$.next(result);
  }

  async turnOn() {
    from(this.device.setPower(true))
      .pipe(delay(10))
      .subscribe(() => this.state$.next(true))
  }

  async turnOff() {
    from(this.device.setPower(false))
      .pipe(delay(10))
      .subscribe(() => this.state$.next(false))
  }

  async toggle() {
    await this.device.setPower(!this.state);
    this.state$.next(!this.state);
  }

  async listenChanges() {
    fromEvent(this.device, "powerChanged")
      .pipe(map(([status]) => status))
      .subscribe(this.state$);
  }

  serviceHandler(service) {
    try {
      this[service]();
    } catch (e) {
      console.log(`Method ${service} not implemented.`);
    }
  }
}