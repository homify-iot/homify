import { Observable, Subject, BehaviorSubject } from "rxjs";
import { share } from "rxjs/operators";
export default class {
  private health$: BehaviorSubject<boolean> = new BehaviorSubject(true);
  private status$: Subject<any> = new Subject();

  constructor(device$) {
    console.log("Connected to", device$);
  }

  public onStatus(): Observable<{}> {
    return this.status$.pipe(share());
  }

  public onHealth(): Observable<{}> {
    return this.health$.pipe(share());
  }

}
