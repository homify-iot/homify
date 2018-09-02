import Entity from "platforms/_entity";
import { createDebug } from "services/debug.service";

const log = createDebug("Platform:sensor:");

export abstract class Sensor extends Entity {
  get type() {
    return "sensor";
  }
  public abstract listenChanges();
  public serviceHandler(service) {
    try {
      this[service]();
    } catch (e) {
      log(`Method ${service} not implemented.`);
    }
  }
}
