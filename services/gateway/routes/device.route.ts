import * as express from "express";
import { getAllDevices } from "../controllers/device.controller";

const router = express.Router();

router.route("/").get(getAllDevices);

export default router;
