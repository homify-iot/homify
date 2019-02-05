import { accessoryRoutes } from "@/routes/accessory.route";
import express from "express";

const router = express.Router();

router.use("/accessories", accessoryRoutes);

export default router;
