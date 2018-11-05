import * as express from "express";
import {
  getAllAutomations,
  getAllEntities, getLogs, getOnlinePool, getStatePool, updateAutomation, updateEntity
} from "../controllers/entity.controller";

const router = express.Router();

router
  .route("/")
  .get(getAllEntities);

router
  .route("/automations")
  .get(getAllAutomations);

router
  .route("/automation/:id")
  .put(updateAutomation);

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
  .put(updateEntity);
export default router;
