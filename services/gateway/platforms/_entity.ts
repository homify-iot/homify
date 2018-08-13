import { Subject } from "rxjs"
import { distinctUntilChanged } from "rxjs/operators";
import { broadcastStateChange, serviceRegister } from "@/core/bus";
import { IMqttMessage } from "@/types/mqtt.model";

export default abstract class Entity {
  entity_id;
  name;
  attrs;
  state;
  icon;
  image;
  state$: Subject<boolean> = new Subject();
  constructor() {
    this.state$
      .pipe(distinctUntilChanged())
      .subscribe(this.onStateChange);
  }
  onStateChange = (state) => {
    this.state = state;
    broadcastStateChange(this, state).subscribe();
  }
  register = () => {
    serviceRegister(this.entity_id)
      .subscribe((packet: IMqttMessage) => {
        this.serviceHandler(packet.payload.toString())
      })
  }
  public abstract serviceHandler(service);
}