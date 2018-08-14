import { Subject } from "rxjs"

export default class Homify {
  public config = {};
  public components = [];
  public components$: Subject<any[]> = new Subject();

  get entities() {
    return this.components.map(c => ({
      entity_id: c.entity_id,
      name: c.name,
      state: c.state,
      icom: c.icon,
      image: c.image,
      type: c.type,
      available: c.available
    }))
  }

  add_component(device) {
    device.register();
    this.components.push(device);
    this.components$.next(this.components);
  }
}