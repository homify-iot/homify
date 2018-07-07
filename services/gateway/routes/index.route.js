import express from "express";
import roomRoutes from "./room.route";

const router = express.Router();

router.use("/rooms", roomRoutes);

export default router;
