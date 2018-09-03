import * as EventBus from "core/EventBus";
import homify from "core/Homify";
import { createDebug } from "services/debug.service";
import { EntityObject, State } from "types/homify";
import { IMqttMessage } from "types/mqtt";

const log = createDebug("Entity");


export default abstract class Entity {
  public abstract entityId: string;
  public abstract defaultName: string;
  public name: string;
  public icon: string;
  public image: string;
  public abstract type: string;
  public _state: State;
  public abstract listenChanges();
  get state(): State {
    return this._state;
  }

  set state(newState: State) {
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
      icon: this.icon,
      image: this.image,
      type: this.type,
    };
  }

  public serviceHandler(service) {
    try {
      this[Symbol.for(service)]();
    } catch (e) {
      log(`Method ${service} not implemented.`);
    }
  }
}
