import homify from "core/homify";

export const getAllEntities = (_req, res) => {
  res.json(homify.entities);
};

