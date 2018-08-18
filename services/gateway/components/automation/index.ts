import { getStateListener, callService } from "core/bus";
import { IMqttMessage } from "types/mqtt.model";
import { map, filter } from "rxjs/operators";
import * as R from "ramda";
import { createDebug } from "services/debug.service";

const log = createDebug("automation");
export default class Automation {
  constructor(private job) { }

  start() {
    R.map(this.attachTrigger, this.job.triggers);
  }

  private attachTrigger = (trigger) => {
    if (trigger.type === "state") {
      getStateListener(trigger.entityId)
        .pipe(
          map((packet: IMqttMessage) => JSON.parse(packet.payload.toString())),
          filter(state => state === trigger.to)
        )
        .subscribe(() => R.map(this.triggerAction, this.job.actions));
    }
  }

  private triggerAction = (action) => {
    log(action.entityId, action.service)
    callService(action.entityId, action.service).subscribe();
  }
}