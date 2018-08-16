import { homify } from "@/index";
import { createDebug } from "services/debug.service";
import Entity from "../_entity";
import { fromEvent } from "rxjs";

const log = createDebug("Platform:sensor:xiaomi_aqara");

export const setup_platform = (device) => {
  log('Connected ', device.miioModel);
  if (device.miioModel === "lumi.motion") {
    const component = new XiaomiMotionSensor(device);
    homify.add_component(component);
  }
}
class XiaomiMotionSensor extends Entity {
  entity_id: string;
  name: string;
  available: boolean;

  constructor(private device) {
    super();
    this.entity_id = device.id;
    this.name = "Motion sensor";
    this.available = true;
    this.listenChanges();
  }

  async listenChanges() {
    fromEvent(this.device, "movement")
      .subscribe(() => this.state = true);
  }

  serviceHandler(service) {
    try {
      this[service]();
    } catch (e) {
      log(`Method ${service} not implemented.`);
    }
  }
}