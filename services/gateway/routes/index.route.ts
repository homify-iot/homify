import express from "express";
import roomRoutes from "./room.route";
import deviceRoutes from "./device.route";
import floorplanRoutes from "./floorplan.route";

const router = express.Router();

router.use("/rooms", roomRoutes);
router.use("/devices", deviceRoutes);
router.use("/floorplan", floorplanRoutes);

export default router;
