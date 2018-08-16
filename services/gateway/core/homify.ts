import { Subject } from "rxjs"
import { EntityObject } from "platforms/_entity";
import { debounceTime, distinctUntilChanged, switchMap } from "../node_modules/rxjs/operators";
import { broadcastEntitiesChange } from "core/bus";

export default class Homify {
  public config = {};
  public entities: EntityObject[];
  private onUpdate$: Subject<EntityObject[]> = new Subject();

  constructor() {
    this.entities = new Proxy([], {
      set: (target, property, entity) => {
        target[property] = entity;
        this.onUpdate$.next(target);
        return true;
      }
    })
    this.onUpdate$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(broadcastEntitiesChange)
    ).subscribe()
  }

  add_component(device) {
    device.register();
    this.entities.push(device.toObject());
  }
}