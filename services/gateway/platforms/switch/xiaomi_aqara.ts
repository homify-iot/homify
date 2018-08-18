import { homify } from "@/index";
import { createDebug } from "services/debug.service";
import { XiaomiGenericSwitch } from "./_switch";

const log = createDebug("Platform:switch:xiaomi_aqara");

export const setupPlatform = (device) => {
  log("Connected ", device.miioModel);
  if (device.miioModel === "lumi.ctrl_neutral1") {
    homify.add_component(new XiaomiWallSwitch(device.child("0"), "Wall Switch"));
  } else if (device.miioModel === "lumi.ctrl_neutral2") {
    homify.add_component(new XiaomiWallSwitch(device.child("0"), "Wall Switch Left"));
    homify.add_component(new XiaomiWallSwitch(device.child("1"), "Wall Switch Right"));
  }
};

class XiaomiWallSwitch extends XiaomiGenericSwitch {
  public entityId: string;
  public name: string;
  public available: boolean;
  constructor(device, name) {
    super(device);
    this.entityId = device.id;
    this.available = true;
    this.name = name;
    this.icon = "device/lightbulb";
  }
}
