import { homify } from "@/index";
import { createDebug } from "services/debug.service";
import Entity from "../_entity";

const log = createDebug("Platform:sensor:xiaomi_aqara");

export const setup_platform = (device) => {
  log('Connected ', device.miioModel);
  if (device.miioModel === "lumi.motion") {
    const component = new XiaomiSensor(device);
    homify.add_component(component);
  }
}
class XiaomiSensor extends Entity {
  constructor(_device) {
    super();
    this.name = "motion sensor";
    // this.image = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpSah187ddN15p9mx63JUb13w6_F0AzlUKVfJ9-JWwakmuCMLv";
    this.icon = "device/lightbulb";
  }
  serviceHandler(service) {
    try {
      this[service]();
    } catch (e) {
      log(`Method ${service} not implemented.`);
    }
  }
}