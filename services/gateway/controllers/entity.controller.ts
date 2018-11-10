import { Automations, Entities, Logs} from "config/db";
import homify from "core/Homify";

export const getAllEntities = (_req, res) => {
  Entities.find()
    .then((entities) => {
      res.json(entities);
    });
};

export const getAllAutomations = (_req, res) => {
  Automations.find()
    .then((automations) => {
      res.json(automations);
    });
};

export const addAutomation = (req, res) => {
  Automations.create({
    name: req.body.name,
    status: true,
    type: "automation",
    triggers: [],
    actions: []
  }).then((automations) => {
    return Automations.findOneAndUpdate({_id: automations._id}, {entityId: automations._id});
  }).then((automations) => {
    res.json(automations);
  });
};

export const updateAutomation = (req, res) => {
  Automations.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
    .then((automations) => {
      res.json(automations);
    });
};

export const addCondition = (req, res) => {
  const key = req.params.type === "if" ? "triggers" : "actions";
  Automations.findOneAndUpdate(
    { _id: req.params.id },
    { $addToSet: {[key]: req.body}},
    { new: true })
    .then((automations) => {
      res.json(automations);
    });
};

export const removeCondition = (req, res) => {
  const key = req.params.type === "if" ? "triggers" : "actions";
  Automations.findOneAndUpdate(
    { _id: req.params.id },
    { $pull: {[key]: {entityId: req.body.entityId}}},
    { new: true })
    .then((automations) => {
      res.json(automations);
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

export const updateEntity = (req, res) => {
  Entities.findByIdAndUpdate(req.body._id, req.body, { new: true })
    .then((entities) => {
      res.json(entities);
    });
};
