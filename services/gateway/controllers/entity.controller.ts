import { homify } from "@/index";

export const getAllEntities = (_req, res) => {
  res.json(homify.entities);
};

