import express from "express";
import entityRoutes from "./entity.route";
import floorplanRoutes from "./floorplan.route";

const router = express.Router();

router.use("/entities", entityRoutes);
router.use("/floorplan", floorplanRoutes);

export default router;
