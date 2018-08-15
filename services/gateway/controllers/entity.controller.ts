import { homify } from "@/index"
import { createDebug } from "services/debug.service";
const log = createDebug("/entities");

export const getAllEntities = (_req, res) => {
  log(homify.entities);
  res.json(homify.entities)
};
