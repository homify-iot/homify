import { homify } from "@/index";
import { XiaomiGenericSwitch } from "./_switch"
import { createDebug } from "services/debug.service";

const log = createDebug("Platform:switch:xiaomi_aqara");

export const setup_platform = (device) => {
  log('Connected ', device.miioModel);
  if (device.miioModel === "lumi.ctrl_neutral1") {
    homify.add_component(new XiaomiWallSwitch(device.child('0'), "Wall Switch"));
  } else if (device.miioModel === "lumi.ctrl_neutral2") {
    homify.add_component(new XiaomiWallSwitch(device.child('0'), "Wall Switch Left"));
    homify.add_component(new XiaomiWallSwitch(device.child('1'), "Wall Switch Right"));
  }
}

class XiaomiWallSwitch extends XiaomiGenericSwitch {
  entity_id: string;
  name: string;
  available: boolean;
  constructor(device, name) {
    super(device);
    this.entity_id = device.id;
    this.available = true;
    this.name = name;
    // this.image = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpSah187ddN15p9mx63JUb13w6_F0AzlUKVfJ9-JWwakmuCMLv";
    this.icon = "device/lightbulb";
  }
}