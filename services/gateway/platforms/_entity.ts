import EventBus from "core/EventBus";
import homify from "core/homify";
import { createDebug } from "services/debug.service";
import { IMqttMessage } from "types/mqtt";

const log = createDebug("Entity");

export interface EntityObject {
  entityId: string;
  name: string;
  state: boolean;
  icon: string;
  image: string;
  type: string;
}
export default abstract class Entity {
  public abstract entityId: string;
  public abstract defaultName: string;
  public name: string;
  public icon: string;
  public image: string;
  public abstract type: string;
  public _state: boolean;

  get state() {
    return this._state;
  }

  set state(newState) {
    if (newState !== this._state) {
      const stateInfo = {
        state: newState,
        last_update: new Date()
      };
      homify.statePool[this.entityId] = stateInfo;
      EventBus.broadcastStateChange(this, stateInfo).subscribe();
    }
    this._state = newState;
  }

  public register = () => {
    EventBus.serviceRegister(this.entityId)
      .subscribe((packet: IMqttMessage) => {
        const { topic, payload } = packet;
        const service = JSON.parse(payload.toString());
        log(topic, service);
        this.serviceHandler(service);
      });
  }

  public toObject(): EntityObject {
    return {
      entityId: this.entityId,
      name: this.defaultName,
      state: this.state,
      icon: this.icon,
      image: this.image,
      type: this.type,
    };
  }

  public abstract serviceHandler(service);
}
