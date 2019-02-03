import { accessoryRoutes } from "@/routes/accessory.route";
import express from "express";

const router = express.Router();

router.use("/accessories", accessoryRoutes);
// router.use("/floorplan", floorplanRoutes);

export default router;
