import * as express from "express";
import {
  addAutomation,
  addCondition,
  getAllAutomations,
  getAllEntities,
  getLogs,
  getOnlinePool,
  getStatePool,
  removeCondition,
  updateAutomation,
  updateEntity
} from "../controllers/entity.controller";

const router = express.Router();

router
  .route("/")
  .get(getAllEntities);

router
  .route("/automations")
  .get(getAllAutomations)
  .post(addAutomation);

router
  .route("/automation/:id")
  .put(updateAutomation);

router
  .route("/automation/:id/:type")
  .put(addCondition)
  .delete(removeCondition);

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
