import * as express from "express";
import {
  getAllAutomations,
  getAllEntities, getLogs, getOnlinePool, getStatePool, postEntity
} from "../controllers/entity.controller";

const router = express.Router();

router
  .route("/")
  .get(getAllEntities);

router
  .route("/automations")
  .get(getAllAutomations);

router
  .route("/states")
  .get(getStatePool);

router
  .route("/online")
  .get(getOnlinePool);

router
  .route("/logs/:entityId")
  .get(getLogs);

router
  .route("/:id")
  .post(postEntity);
export default router;
