import { Devices } from "../config/db"
import { mqtt } from "..";

export const loadDevices = () => {
  Devices
    .find({})
    .populate("type")
    .exec()
    .then(devices => {
      mqtt.registerDevices(devices);
    })
}