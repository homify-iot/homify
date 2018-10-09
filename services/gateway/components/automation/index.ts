import * as EventBus from "core/EventBus";
import homify from "core/Homify";
import * as R from "ramda";
import { combineLatest } from "rxjs";
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
    homify.statePool[this.job._id] = stateInfo;
    EventBus.getAutomationStateListener(this.job._id)
      .pipe(
        map((packet: IMqttMessage) => JSON.parse(packet.payload.toString())),
        map(({ state }) => state)
      )
      .subscribe((status) => this.status = status);
    EventBus.broadcastAutomationStateChange(this.job, stateInfo).subscribe();
  }

  public start() {
    combineLatest(
      ...this.job.triggers.map(this.attachTrigger)
    ).pipe(
      takeWhile(() => this.status),
      filter((stateArray) => stateArray.every(Boolean))
    )
      .subscribe(() => R.map(this.triggerAction, this.job.actions));
  }

  private attachTrigger = (trigger) => {
    return EventBus.getStateListener(trigger.entityId)
      .pipe(
        map((packet: IMqttMessage) => JSON.parse(packet.payload.toString())),
        map((stateInfo) => stateInfo.state === trigger.to),
      );
  }

  private triggerAction = (action) => {
    log(action.entityId, action.service);
    EventBus.callService(action.entityId, action.service).subscribe();
  }
}
