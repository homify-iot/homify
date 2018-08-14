import Entity from "../_entity";

export default abstract class SwitchDevice extends Entity {
  get type() {
    return "switch"
  }
  get isOn() {
    return this.state;
  }

  public abstract getCurrentState();

  public abstract turnOn();

  public abstract turnOff();

  public abstract toggle();

  public abstract listenChanges();

}