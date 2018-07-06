import express from "express";
import gatewayRoutes from "./gateway.route";

const router = express.Router();

router.use("/gateway", gatewayRoutes);

export default router;
