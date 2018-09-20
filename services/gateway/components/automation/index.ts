import * as EventBus from "core/EventBus";
import * as R from "ramda";
import { filter, map, takeWhile } from "rxjs/operators";
import { createDebug } from "services/debug.service";
import { IMqttMessage } from "types/mqtt";

const log = createDebug("Automation");
export default class Automation {
  private status: boolean;
  constructor(private job) {
    const stateInfo = {
      state: this.job.status,
      last_update: new Date()
    };
    EventBus.getAutomationStateListener(this.job._id)
      .pipe(
        map((packet: IMqttMessage) => JSON.parse(packet.payload.toString())),
        map(({ state }) => state)
      )
      .subscribe((status) => this.status = status);
    EventBus.broadcastAutomationStateChange(this.job, stateInfo).subscribe();
  }

  public start() {
    R.map(this.attachTrigger, this.job.triggers);
  }

  private attachTrigger = (trigger) => {
    if (trigger.type === "state") {
      EventBus.getStateListener(trigger.entityId)
        .pipe(
          takeWhile(() => this.status),
          map((packet: IMqttMessage) => JSON.parse(packet.payload.toString())),
          filter((stateInfo) => stateInfo.state === trigger.to)
        )
        .subscribe(() => R.map(this.triggerAction, this.job.actions));
    }
  }

  private triggerAction = (action) => {
    log(action.entityId, action.service);
    EventBus.callService(action.entityId, action.service).subscribe();
  }
}
