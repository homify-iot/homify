import { broadcastEntitiesChange } from "core/bus";
import { default as Entity, EntityObject } from "platforms/_entity";
import * as R from "ramda";
import { Subject } from "rxjs";
import { debounceTime, distinctUntilChanged, map, switchMap } from "rxjs/operators";
import { createDebug } from "services/debug.service";

const log = createDebug("Core");

export default class Homify {
  public components: Entity[];
  private onUpdate$: Subject<Entity[]> = new Subject();

  constructor(private config) {
    this.components = new Proxy([], {
      set: (target, property, entity) => {
        target[property] = entity;
        this.onUpdate$.next(target);
        return true;
      },
    });
    this.onUpdate$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      map((components) => components.map((c) => c.toObject())),
      switchMap(broadcastEntitiesChange),
    ).subscribe();
  }

  get entities(): EntityObject[] {
    return this.components.map((c) => c.toObject());
  }

  public addComponent(device) {
    device.register();
    const index = R.findIndex(R.propEq("entityId", device.entityId))(this.config.entities);
    if (index !== -1) {
      this.components.push(device);
    } else {
      log("Found new device!");
    }
  }

  public getEntityInfo(entityId: string) {
    return R.find(R.propEq("entityId", entityId))(this.config.entities);
  }
}
