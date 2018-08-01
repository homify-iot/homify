import { BehaviorSubject, Subject } from "rxjs";

export interface Plugin {
  device: any;
  health: BehaviorSubject<boolean>;
  status: BehaviorSubject<any> | Subject<any>;
  registerDevice: (device: any) => void;
}
