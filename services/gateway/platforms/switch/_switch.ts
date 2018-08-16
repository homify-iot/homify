import Entity from "../_entity";
import { fromEvent, from } from "rxjs";
import { map, delay, filter } from "rxjs/operators";
import { createDebug } from "services/debug.service";

const log = createDebug("Platform:Switch")

export abstract class SwitchDevice extends Entity {
  get type() {
    return "switch"
  }
  get isOn() {
    return this.state;
  }

  public abstract getCurrentState();

  public abstract turnOn();

  public abstract turnOff();

  public abstract toggle();

  public abstract listenChanges();

}

export abstract class XiaomiGenericSwitch extends SwitchDevice {
  constructor(private device) {
    super();
    this.getCurrentState();
    this.listenChanges();
  }

  async getCurrentState() {
    const result = await this.device.power();
    this.state = result;
  }

  async turnOn() {
    from(this.device.setPower(true))
      .pipe(delay(10))
      .subscribe(() => this.state = true)
  }

  async turnOff() {
    from(this.device.setPower(false))
      .pipe(delay(10))
      .subscribe(() => this.state = false)
  }

  async toggle() {
    await this.device.setPower(!this.state);
    this.state = !this.state;
  }

  async listenChanges() {
    fromEvent(this.device, "powerChanged")
      .pipe(map(([state]) => state), filter(state => state !== undefined))
      .subscribe((state) => this.state = state);
  }

  serviceHandler(service) {
    try {
      this[service]();
    } catch (e) {
      log(`Method ${service} not implemented.`);
    }
  }
}