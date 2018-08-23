import * as express from "express";
import { getAllEntities, getOnlinePool, getStatePool } from "../controllers/entity.controller";

const router = express.Router();

router
  .route("/")
  .get(getAllEntities);
router
  .route("/states")
  .get(getStatePool);

router
  .route("/online")
  .get(getOnlinePool);
export default router;
