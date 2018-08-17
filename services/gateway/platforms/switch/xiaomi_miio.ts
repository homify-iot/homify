import { homify } from "@/index";
import { XiaomiGenericSwitch } from "./_switch"
import { createDebug } from "services/debug.service";

const log = createDebug("Platform:switch:xiaomi_miio");

export const setup_platform = (device) => {
  log('Connected ', device.miioModel);
  if (device.miioModel === "zimi.powerstrip.v2") {
    const component = new PowerStrip(device);
    homify.add_component(component);
  }
}

class PowerStrip extends XiaomiGenericSwitch {
  entity_id: string;
  name: string;
  available: boolean;
  constructor(device) {
    super(device);
    this.entity_id = device.id;
    this.available = true;
    this.name = "PowerStrip";
    this.image = "https://fb1-cw.lnwfile.com/_/cw/_raw/nl/tn/x8.jpg";
  }
}