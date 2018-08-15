import { homify } from "@/index";
import { XiaomiGenericSwitch } from "./_switch"

export const setup_platform = (device) => {
  console.log('Connected to', device);
  if (device.miioModel === "zimi.powerstrip.v2") {
    const component = new PowerStrip(device);
    homify.add_component(component);
  }
}

class PowerStrip extends XiaomiGenericSwitch {
  constructor(_device) {
    super(_device);
    this.name = "PowerStrip";
    this.image = "https://fb1-cw.lnwfile.com/_/cw/_raw/nl/tn/x8.jpg";
  }

}