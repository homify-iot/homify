import { BehaviorSubject } from "rxjs";

export interface Plugin {
  device: any;
  onlineStatus: BehaviorSubject<boolean>;
  status: BehaviorSubject<boolean>;
  registerDevice: (device: any) => void;
}
