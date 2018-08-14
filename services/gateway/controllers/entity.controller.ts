import { homify } from "@/index"

export const getAllEntities = (_req, res) => {
  console.log(homify.entities);
  res.json(homify.entities)
};
