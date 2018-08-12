import { Subject, BehaviorSubject, of } from "rxjs"

export default class Homify {
  private mqtt;
  public config = {};
  private components = [];
  public components$: Subject<any[]> = new Subject();
  constructor() {
  }
  add_component(device) {
    this.components.push(device);
    this.components$.next(this.components);
  }
  onCom() {
    return of(this.components)
  }
}