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

const DiscoverySchema = new Schema({
  _id: ObjectId,
  name: String,
  gateways: [],
  cacheTime: Number
});
export const Discoveries = mongoose.model("discoveries", DiscoverySchema);

const TypeSchema = new Schema({
  _id: ObjectId,
  platform: String,
  type_name: String
});
export const Types = mongoose.model("types", TypeSchema);

const DeviceSchema = new Schema({
  _id: ObjectId,
  name: String,
  type: { type: ObjectId, ref: "types" },
  online: Boolean,
  state: {},
  config: {},
  attribute: {},
  platform: { type: ObjectId, ref: "devices" }
});
export const Devices = mongoose.model("devices", DeviceSchema);

const RoomsSchema = new Schema({
  _id: ObjectId,
  name: String,
  attributes: {
    image: String,
    icon: String
  },
  devices: [{ type: ObjectId, ref: "devices" }]
});
export const Rooms = mongoose.model("rooms", RoomsSchema);

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
