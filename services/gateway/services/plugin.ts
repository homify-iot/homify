import { Observable } from "rxjs";

export class Plugin {
  device: any;
  // $health: BehaviorSubject<boolean> | Subject<any>;
  // $status: BehaviorSubject<any> | Subject<any> | ReplaySubject<any>;
  setState: (value) => Observable<any>;
}
