import {Automations} from "@/config/db";
import { StateInfo } from "@/types/homify";
import * as EventBus from "core/EventBus";
import homify from "core/Homify";
import * as R from "ramda";
import { combineLatest, merge, of } from "rxjs";
import { filter, map, startWith, switchMap } from "rxjs/operators";
import { createDebug } from "services/debug.service";
import { IMqttMessage } from "types/mqtt";

const log = createDebug("Automation");
export default class Automation {
  private stateInfo: StateInfo;
  constructor(private job) {
    this.stateInfo = {
      state: this.job.status,
      last_update: new Date()
    };
    homify.statePool[this.job._id] = this.stateInfo;
    homify.onlinePool[this.job._id] = true;
    EventBus.getAutomationStateListener(this.job._id)
      .pipe(
        map((packet: IMqttMessage) => JSON.parse(packet.payload.toString())),
        map(({state}) => ({ state, last_update: new Date()}))
      )
      .subscribe((stateInfo) => {
        this.stateInfo = stateInfo;
        this.updateStateToDB(this.job._id, stateInfo.state);
      });
  }

  public start() {
    merge(
      of(this.job),
      EventBus.getAutomationListener(this.job._id)
        .pipe(
          map((packet: IMqttMessage) => JSON.parse(packet.payload.toString()))
        )
    )
    .pipe(
      switchMap((job) => combineLatest(
        ...job.triggers.map(this.attachTrigger)
      )),
      filter(() => Boolean(this.stateInfo.state)),
      filter((stateArray) => stateArray.every(Boolean))
    )
      .subscribe(() => R.map(this.triggerAction, this.job.actions));
  }

  private attachTrigger(trigger) {
    return EventBus.getStateListener(trigger.entityId)
      .pipe(
        map((packet: IMqttMessage) => JSON.parse(packet.payload.toString())),
        startWith( homify.statePool[trigger.entityId] || { state: undefined }),
        map((stateInfo) => stateInfo.state === trigger.to)
      );
  }

  private triggerAction(action) {
    log(action.entityId, action.service);
    EventBus.callService(action.entityId, action.service).subscribe();
  }

  private updateStateToDB(_id: string, status: boolean) {
    Promise.resolve(
      Automations.findOneAndUpdate(
      { _id },
      { status })
    );
  }
}
