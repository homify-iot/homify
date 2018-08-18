import bodyParser from "body-parser";
import express from "express";
import routes from "../routes/index.route";

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/v1", routes);
export default app;
