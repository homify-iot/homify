import express from "express";

const router = express.Router();

router.route("/test").get((req, res) => {
  console.log(req, res);
  res.send("It works!");
});

export default router;
