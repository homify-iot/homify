import { homify } from "@/index";
import { createDebug } from "services/debug.service";
import { XiaomiGenericSwitch } from "./_switch";

const log = createDebug("Platform:switch:xiaomi_miio");

export const setupPlatform = (device) => {
  log("Connected ", device.miioModel);
  if (device.miioModel === "zimi.powerstrip.v2") {
    const component = new PowerStrip(device);
    homify.add_component(component);
  }
};

class PowerStrip extends XiaomiGenericSwitch {
  public entityId: string;
  public name: string;
  public available: boolean;
  constructor(device) {
    super(device);
    this.entityId = device.id;
    this.available = true;
    this.name = "PowerStrip";
    this.image = "https://fb1-cw.lnwfile.com/_/cw/_raw/nl/tn/x8.jpg";
  }
}
