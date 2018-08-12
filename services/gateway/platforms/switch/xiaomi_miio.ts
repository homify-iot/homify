import miio from "miio";
import { homify } from "@/index";
import SwitchDevice from "./_switch"
import { Subject } from "rxjs"

export const setup_platform = (config) => {
  miio.device({ address: config.host })
    .then(device => {
      console.log('Connected to', device);
      const component = new PowerStrip(device, config);
      homify.add_component(component);
    })
    .catch(console.log);
}

class PowerStrip {
  name;
  attrs;
  id;
  model;
  state: Subject<boolean> = new Subject();
  constructor(private device, private config) {
    this.id = device.id;
    this.name = "PowerStrip " + device.id;
    this.model = device.model;
    this.getState();
  }
  async getState() {
    const result = await this.device.power();
    this.state.next(result);
  }
  async turnOn() {
    const result = await this.device.setPower(true);
  }

  async turnOff() {
    const result = await this.device.setPower(false);
  }
}