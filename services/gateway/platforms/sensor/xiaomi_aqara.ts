import homify from "core/Homify";
import { fromEvent, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { createDebug } from "services/debug.service";
import { State } from "types/homify";
import { BinarySensor, Sensor } from "./_sensor";

const log = createDebug("Platform:sensor:xiaomi_aqara");

export const setupPlatform = (device) => {
  log("Connected ", device.miioModel);
  if (device.miioModel === "lumi.motion") {
    const component = new XiaomiMotionSensor(device);
    homify.addComponent(component);
  } else if (device.miioModel === "lumi.weather") {
    homify.addComponent(new XiaomiSensor(device, "temperature"));
    homify.addComponent(new XiaomiSensor(device, "humidity"));
  }
};

class XiaomiMotionSensor extends BinarySensor {
  public entityId: string;
  public icon: string = "device/motion";
  public defaultName: string = "Motion sensor";
  public available: boolean = true;
  public autoIdleTimeout: number = 1000 * 60;
  public idleTimer;
  constructor(private device) {
    super();
    this.entityId = device.id;
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
}

class XiaomiSensor extends Sensor {
  public entityId: string;
  public icon: string;
  public unit: string;
  public defaultName: string;
  public available: boolean = true;
  constructor(private device, public category: string) {
    super();
    this.entityId = device.id + category;
    this.icon = `device/${category}`;
    this.defaultName = category;
    this.listenChanges();
  }

  public async listenChanges() {
    let state$: Observable<State>;
    if (this.category === "temperature") {
      state$ = fromEvent(this.device, "temperatureChanged")
        .pipe(
          map(([{ value, unit }]) => ({ value, unit: unit === "C" ? "&#8451;" : unit }))
        );

    } else if (this.category === "humidity") {
      state$ = fromEvent(this.device, "relativeHumidityChanged")
        .pipe(
          map(([value]) => ({ value, unit: "%" }))
        );
    }
    state$.subscribe((state: State) => {
      this.state = state;
    });
  }
}
