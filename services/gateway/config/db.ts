import mongoose from "mongoose";
import config from "./config";
const Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

const FloorSchema = new Schema({
  floor: { type: String }
});
export const Floor = mongoose.model("floors", FloorSchema);

const TypeSchema = new Schema({
  _id: ObjectId,
  type_name: String,
  attributes: {}
});
export const Types = mongoose.model("types", TypeSchema);

const DeviceSchema = new Schema({
  _id: ObjectId,
  name: String,
  type: { type: ObjectId, ref: "types" },
  online: Boolean,
  state: {},
  config: {
    children: [{ type: ObjectId, ref: "devices" }],
    model: String,
    address: String
  },
  children: [{ type: { type: ObjectId, ref: "types" } }]
});
export const Devices = mongoose.model("devices", DeviceSchema);

const PlatformSchema = new Schema({
  _id: ObjectId,
  name: String,
  installed: Boolean
});
export const Platform = mongoose.model("platforms", PlatformSchema);

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
  device: { type: ObjectId, ref: "devices" }
});
export const FloorPlans = mongoose.model("floorplans", FloorplanSchema);

mongoose.connection
  .on("connected", () => {
    console.log(`Mongoose connection open on ${config.db}:${config.db_port}`);
  })
  .on("error", err => {
    console.log(`Connection error: ${err.message}`);
  });
export default mongoose;
