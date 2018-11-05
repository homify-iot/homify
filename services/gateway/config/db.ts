// tslint:disable:variable-name
import mongoose from "mongoose";
import { createDebug } from "services/debug.service";
import config from "./config";

const log = createDebug("DB");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const FloorSchema = new Schema({
  floor: { type: String }
});
export const Floor = mongoose.model("floors", FloorSchema);

const EntitySchema = new Schema({
  entityId: String,
  name: String,
  icon: String,
  image: String,
  type: String,
  platform: String,
  group: String
});
export const Entities = mongoose.model("entities", EntitySchema);

const AutomationSchema = new Schema({
  _id: ObjectId,
  entityId: ObjectId,
  name: String,
  status: Boolean,
  triggers: {},
  actions: {}
});
export const Automations = mongoose.model("automations", AutomationSchema);

const LogSchema = new Schema({
  category: String,
  entityId: String,
  entityName: String,
  details: String
});
export const Logs = mongoose.model("logs", LogSchema);

const FloorplanSchema = new Schema({
  _id: ObjectId,
  tag: String,
  device: { type: ObjectId, ref: "devices" },
  attributes: {}
});
export const FloorPlans = mongoose.model("floorplans", FloorplanSchema);

mongoose.connection
  .on("connected", () => {
    log(`Mongoose connection open on ${config.db}:${config.db_port}`);
  })
  .on("error", (err) => {
    log(`Connection error: ${err.message}`);
  });
export default mongoose;
