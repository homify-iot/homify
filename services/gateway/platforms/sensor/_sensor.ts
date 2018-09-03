import Entity from "platforms/_entity";

export abstract class Sensor extends Entity {
  get type() {
    return "sensor";
  }
}

export abstract class BinarySensor extends Entity {
  get type() {
    return "binarySensor";
  }
}
