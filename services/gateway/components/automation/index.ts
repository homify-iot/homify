import EventBus from "core/EventBus";
import * as R from "ramda";
import { filter, map } from "rxjs/operators";
import { createDebug } from "services/debug.service";
import { IMqttMessage } from "types/mqtt.model";

const log = createDebug("Automation");
export default class Automation {
  constructor(private job) { }

  public start() {
    R.map(this.attachTrigger, this.job.triggers);
  }

  private attachTrigger = (trigger) => {
    if (trigger.type === "state") {
      EventBus.getStateListener(trigger.entityId)
        .pipe(
          map((packet: IMqttMessage) => JSON.parse(packet.payload.toString())),
          filter((state) => state === trigger.to)
        )
        .subscribe(() => R.map(this.triggerAction, this.job.actions));
    }
  }

  private triggerAction = (action) => {
    log(action.entityId, action.service);
    EventBus.callService(action.entityId, action.service).subscribe();
  }
}
