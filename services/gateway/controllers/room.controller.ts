import { Rooms } from "../config/db";

export const getAllRooms = (_req, res, next) => {
  Rooms.find({}).exec((err, rooms) => {
    if (err) {
      console.log(err);
      next(err);
    } else {
      res.json(rooms);
    }
  });
};
