
import homify from "core/homify";
import { createDebug } from "services/debug.service";
import { XiaomiGenericSwitch } from "./_switch";

const log = createDebug("Platform:switch:xiaomi_aqara");

export const setupPlatform = (device) => {
  log("Connected ", device.miioModel);
  if (device.miioModel === "lumi.ctrl_neutral1") {
    homify.addComponent(new XiaomiWallSwitch(device.child("0"), "Wall Switch"));
  } else if (device.miioModel === "lumi.ctrl_neutral2") {
    homify.addComponent(new XiaomiWallSwitch(device.child("0"), "Wall Switch Left"));
    homify.addComponent(new XiaomiWallSwitch(device.child("1"), "Wall Switch Right"));
  }
};

class XiaomiWallSwitch extends XiaomiGenericSwitch {
  public entityId: string;
  public icon = "device/lightbulb";
  public available: boolean = true;

  constructor(device, public defaultName: string) {
    super(device);
    this.entityId = device.id;
  }
}
