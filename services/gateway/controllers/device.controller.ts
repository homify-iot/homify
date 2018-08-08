import { Devices } from "../config/db";

export const getAllDevices = (_req, res, next) => {
  Devices.find({})
    .populate("type platform entities")
    .populate({
      path: "entities",
      populate: {
        path: "type",
        model: "types"
      }
    })
    .exec((err, rooms) => {
      if (err) {
        console.log(err);
        next(err);
      } else {
        res.json(rooms);
      }
    });
};
