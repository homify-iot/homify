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
  available: boolean,
  state_update_time: Date
}
export default abstract class Entity {
  abstract entity_id: string;
  abstract name: string;
  state_attrs: any[];
  icon: string;
  image: string;
  type: string;
  abstract available: boolean = false;
  _state: boolean;
  state_update_time: Date;
  type_attrs: {}

  get state() {
    return this._state;
  }

  set state(newState) {
    if (newState !== this._state) {
      broadcastStateChange(this, newState).subscribe();
    }
    this.state_update_time = new Date();
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
      available: this.available,
      state_update_time: this.state_update_time
    }
  }

  public abstract serviceHandler(service);
}