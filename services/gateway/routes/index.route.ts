import express from "express";
import roomRoutes from "./room.route";
import floorplanRoutes from "./floorplan.route";

const router = express.Router();

router.use("/rooms", roomRoutes);

router.use("/floorplan", floorplanRoutes);

export default router;
