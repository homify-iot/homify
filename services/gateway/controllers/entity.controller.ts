import { Entities, Logs } from "config/db";
import homify from "core/Homify";

export const getAllEntities = (_req, res) => {
  Entities.find()
    .then((entities) => {
      res.json(entities);
    });
};

export const getStatePool = (_req, res) => {
  res.json(homify.statePool);
};

export const getOnlinePool = (_req, res) => {
  res.json(homify.onlinePool);
};

export const getLogs = (req, res) => {
  Logs.find({ entityId: req.params.entityId })
    .then((logs) => {
      res.json(logs);
    });
};

export const postEntity = (req, res) => {
  Entities.findByIdAndUpdate(req.body._id, req.body, { new: true })
    .then((entities) => {
      res.json(entities);
    });
};
