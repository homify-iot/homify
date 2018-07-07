import { Rooms } from "../config/db"
export const createRoom = (req, res) => {

}

export const getAllRooms = (req, res, next) => {
  Rooms.find({}, (err, rooms) => {
    if (err) {
      next(err);
    } else {
      res.json(rooms);
    }
  });
}