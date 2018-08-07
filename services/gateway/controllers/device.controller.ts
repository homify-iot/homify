import { Devices } from "../config/db";

export const getAllDevices = (_req, res, next) => {
  Devices.find({})
    .populate("type platform")
    .exec((err, rooms) => {
      if (err) {
        console.log(err);
        next(err);
      } else {
        res.json(rooms);
      }
    });
};
