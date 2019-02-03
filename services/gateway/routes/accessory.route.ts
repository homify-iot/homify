import { getAccessories } from "@/controllers/accessory.controller";
import * as express from "express";

export const accessoryRoutes = express.Router();

accessoryRoutes.route("/").get(getAccessories);
