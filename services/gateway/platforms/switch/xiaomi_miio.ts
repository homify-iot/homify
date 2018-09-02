
import homify from "core/Homify";
import { createDebug } from "services/debug.service";
import { XiaomiGenericSwitch } from "./_switch";

const log = createDebug("Platform:switch:xiaomi_miio");

export const setupPlatform = (device) => {
  log("Connected ", device.miioModel);
  if (device.miioModel === "zimi.powerstrip.v2") {
    const component = new PowerStrip(device);
    homify.addComponent(component);
  }
};

class PowerStrip extends XiaomiGenericSwitch {
  public entityId: string;
  public defaultName: string = "PowerStrip";
  public image = "https://fb1-cw.lnwfile.com/_/cw/_raw/nl/tn/x8.jpg";
  constructor(device) {
    super(device);
    this.entityId = device.id;
  }
}
