import * as express from "express";
import { getFloorplan } from "../controllers/floorplan.controller";

const router = express.Router();

router.route("/").get(getFloorplan);

export default router;
