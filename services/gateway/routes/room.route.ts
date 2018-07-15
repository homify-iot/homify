import * as express from "express";
import { getAllRooms } from "../controllers/room.controller";

const router = express.Router();

router
  .route("/")
  .get(getAllRooms);

export default router;
