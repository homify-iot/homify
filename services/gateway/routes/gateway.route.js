import express from "express";

const router = express.Router();

router.route("/test").get((req, res) => {
  console.log('suc');
  res.send("It works!");
});

export default router;
