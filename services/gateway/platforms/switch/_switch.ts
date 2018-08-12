import { Subject } from "rxjs"

export default class SwithcDevice {
  state: Subject<boolean>
  turnOn() { }
  turnOff() { }
}