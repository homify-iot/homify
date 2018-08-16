import Entity from "platforms/_entity";

export abstract class Sensor extends Entity {
  get type() {
    return "sensor"
  }
  get isOn() {
    return this.state;
  }

  public abstract listenChanges();

}