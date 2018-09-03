import { from, fromEvent } from "rxjs";
import { delay, filter, map } from "rxjs/operators";
import Entity from "../_entity";

const turnOn = Symbol.for("turnOn");
const turnOff = Symbol.for("turnOff");
const toggle = Symbol.for("toggle");
export abstract class SwitchDevice extends Entity {
  get type() {
    return "switch";
  }
  get isOn() {
    return this.state;
  }

  public abstract getCurrentState();

  public abstract [turnOn]();

  public abstract [turnOff]();

  public abstract [toggle]();

}

export abstract class XiaomiGenericSwitch extends SwitchDevice {
  constructor(private device) {
    super();
    this.getCurrentState();
    this.listenChanges();
  }

  public async getCurrentState() {
    const result = await this.device.power();
    this.state = result;
  }

  public async [turnOn]() {
    from(this.device.setPower(true))
      .pipe(delay(10))
      .subscribe(() => this.state = true);
  }

  public async [turnOff]() {
    from(this.device.setPower(false))
      .pipe(delay(10))
      .subscribe(() => this.state = false);
  }

  public async [toggle]() {
    await this.device.setPower(!this.state);
    this.state = !this.state;
  }

  public async listenChanges() {
    fromEvent(this.device, "powerChanged")
      .pipe(map(([state]) => state), filter((state) => state !== undefined))
      .subscribe((state) => this.state = state);
  }
}
