import { Subject } from "rxjs"
import { default as Entity, EntityObject } from "platforms/_entity";
import { debounceTime, distinctUntilChanged, switchMap, map } from "rxjs/operators";
import { broadcastEntitiesChange } from "core/bus";

export default class Homify {
  public config = {};
  public components: Entity[];
  private onUpdate$: Subject<Entity[]> = new Subject();

  constructor() {
    this.components = new Proxy([], {
      set: (target, property, entity) => {
        target[property] = entity;
        this.onUpdate$.next(target);
        return true;
      }
    })
    this.onUpdate$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      map(components => components.map(c => c.toObject())),
      switchMap(broadcastEntitiesChange)
    ).subscribe()
  }

  get entities(): EntityObject[] {
    return this.components.map(c => c.toObject());
  }

  add_component(device) {
    device.register();
    this.components.push(device);
  }
}