import { homify } from "@/index";
import SwitchDevice from "./_switch"
import { fromEvent, from } from "rxjs";
import { map, delay } from "rxjs/operators";

export const setup_platform = (device) => {
  if (device.miioModel === "lumi.ctrl_neutral2") {
    for (const childSwitch of device.children()) {
      const component = new XiaomiWallSwitch(childSwitch);
      homify.add_component(component);
    }
  }
}
class XiaomiWallSwitch extends SwitchDevice {
  constructor(private device) {
    super();
    this.entity_id = device.id;
    this.name = "Wall Switch";
    // this.image = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpSah187ddN15p9mx63JUb13w6_F0AzlUKVfJ9-JWwakmuCMLv";
    this.icon = "device/lightbulb";
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