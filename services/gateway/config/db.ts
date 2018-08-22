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
  _id: ObjectId,
  entityId: String,
  name: String,
  type: String,
  platform: String,
  group: String
});
export const Entities = mongoose.model("entities", EntitySchema);

const AutomationSchema = new Schema({
  _id: ObjectId,
  triggers: {},
  actions: {}
});
export const Automations = mongoose.model("automations", AutomationSchema);

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
