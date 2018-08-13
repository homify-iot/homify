import * as express from "express";
import { getAllEntities } from "../controllers/entity.controller";

const router = express.Router();

router
  .route("/")
  .get(getAllEntities);

export default router;
