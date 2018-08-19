import { homify } from "@/index";
import miio from "miio";
import { fromEvent } from "rxjs";
import { createDebug } from "services/debug.service";
import Entity from "../_entity";

const log = createDebug("Platform:sensor:xiaomi_aqara");

export const setupPlatform = (info) => {
  miio.device({ address: info.address })
    .then(handleDevice)
    .catch(log);
};

const handleDevice = (device) => {
  if (device.matches("cap:children")) {
    const children = device.children();
    for (const child of children) {
      if (child.matches("type:sensor")) {
        log("Connected ", child.miioModel);
        if (child.miioModel === "lumi.motion") {
          const component = new XiaomiMotionSensor(child);
          homify.addComponent(component);
        }
      }
    }
  }
};

class XiaomiMotionSensor extends Entity {
  public entityId: string;
  public icon: string = "device/motion";
  public name: string;
  public available: boolean;
  public autoIdleTimeout: number = 1000 * 60;
  public idleTimer;
  constructor(private device) {
    super();
    this.entityId = device.id;
    this.name = "Motion sensor";
    this.available = true;
    this.listenChanges();
  }

  public async listenChanges() {
    fromEvent(this.device, "movement")
      .subscribe(() => {
        this.state = true;
        clearTimeout(this.idleTimer);
        this.idleTimer = setTimeout(() => this.state = false, this.autoIdleTimeout);
      });
  }

  public serviceHandler(service) {
    try {
      this[service]();
    } catch (e) {
      log(`Method ${service} not implemented.`);
    }
  }
}
