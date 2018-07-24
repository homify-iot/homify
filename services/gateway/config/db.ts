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
  color: String,
  icon: String,
  config: {}
});
export const Types = mongoose.model("types", TypeSchema);

const DeviceSchema = new Schema({
  _id: ObjectId,
  name: String,
  type: { type: ObjectId, ref: "types" },
  state: {},
  config: {}
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
    console.log(`Mongoose connection open on ${config.db}:${config.db_port}`);
  })
  .on("error", err => {
    console.log(`Connection error: ${err.message}`);
  });
export default mongoose;
