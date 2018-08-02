import { BehaviorSubject, ReplaySubject, Subject } from "rxjs";

export interface Plugin {
  device: any;
  $health: BehaviorSubject<boolean> | Subject<any>;
  $status: BehaviorSubject<any> | Subject<any> | ReplaySubject<any>;
  registerDevice: (device: any) => void;
}
