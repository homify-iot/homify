import { broadcastStateChange, serviceRegister } from "@/core/bus";
import { IMqttMessage } from "@/types/mqtt.model";
import { createDebug } from "services/debug.service";

const log = createDebug("Entity")

export interface EntityObject {
  entity_id: string,
  name: string,
  state: boolean,
  icon: string,
  image: string,
  type: string,
  available: boolean
}
export default abstract class Entity {
  entity_id: string;
  name: string;
  attrs;
  icon: string;
  image: string;
  type: string;
  available: boolean = false;
  _state: boolean;

  get state() {
    return this._state;
  }

  set state(newState) {
    if (newState !== this._state) {
      broadcastStateChange(this, newState).subscribe();
    }
    this._state = newState;
  }

  register = () => {
    serviceRegister(this.entity_id)
      .subscribe((packet: IMqttMessage) => {
        const { topic, payload } = packet;
        const service = JSON.parse(payload.toString());
        log(topic, service);
        this.serviceHandler(service);
      })
  }

  toObject(): EntityObject {
    return {
      entity_id: this.entity_id,
      name: this.name,
      state: this.state,
      icon: this.icon,
      image: this.image,
      type: this.type,
      available: this.available
    }
  }

  public abstract serviceHandler(service);
}