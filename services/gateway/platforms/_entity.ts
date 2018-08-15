import { broadcastStateChange, serviceRegister } from "@/core/bus";
import { IMqttMessage } from "@/types/mqtt.model";
import { createDebug } from "services/debug.service";

const log = createDebug("Entity")

export default abstract class Entity {
  entity_id: string;
  name: string;
  attrs;
  icon: string;
  image: string;
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
  public abstract serviceHandler(service);
}