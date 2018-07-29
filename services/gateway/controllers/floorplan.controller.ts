import { FloorPlans } from "../config/db";
export const getFloorplan = (_req, res, next) => {
  FloorPlans.find({}).exec((err, data) => {
    if (err) {
      console.log(err);
      next(err);
    } else {
      res.json(data);
    }
  });
};
