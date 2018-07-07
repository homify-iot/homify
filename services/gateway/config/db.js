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
  type: { type: String },
  color: String,
  icon: String
});
export const Types = mongoose.model("types", TypeSchema);

const RoomsSchema = new Schema({
  _id: ObjectId,
  name: String,
  attributes: {
    image: String,
    icon: String
  },
  devices: [
    {
      _id: ObjectId,
      name: String,
      type: { type: ObjectId, ref: "types" }
    }
  ]
});
export const Rooms = mongoose.model("rooms", RoomsSchema);

export default mongoose;
