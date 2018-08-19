import { homify } from "@/index";
import miio from "miio";
import { createDebug } from "services/debug.service";
import { XiaomiGenericSwitch } from "./_switch";

const log = createDebug("Platform:switch:xiaomi_aqara");

export const setupPlatform = (info) => {
  miio.device({ address: info.address })
    .then(handleDevice)
    .catch(log);
};

const handleDevice = (device) => {
  if (device.matches("cap:children")) {
    const children = device.children();
    for (const child of children) {
      if (child.matches("type:wall-switch")) {
        log("Connected ", child.miioModel);
        if (child.miioModel === "lumi.ctrl_neutral1") {
          homify.addComponent(new XiaomiWallSwitch(child.child("0"), "Wall Switch"));
        } else if (child.miioModel === "lumi.ctrl_neutral2") {
          homify.addComponent(new XiaomiWallSwitch(child.child("0"), "Wall Switch Left"));
          homify.addComponent(new XiaomiWallSwitch(child.child("1"), "Wall Switch Right"));
        }
      }
    }
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
