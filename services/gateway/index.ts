import { createDebug } from "services/debug.service";
import config from "./config/config";
import mongoose from "./config/db";
import app from "./config/express";
import { bootstrap } from "./core";
import MqttClient from "./services/mqtt.service";

export const mqttService = new MqttClient();

export const homify = bootstrap(config.homify_config);

const log = createDebug("Server");

const connectWithRetry = () => {
  console.log("MongoDB connection with retry");
  mongoose
    .connect(`mongodb://${config.db}:${config.db_port}/${config.db_name}`)
    .then(() => {
      console.log("MongoDB is connected");
    })
    .catch((err) => {
      console.log(err);
      setTimeout(connectWithRetry, 5000);
    });
};

connectWithRetry();

app.listen(config.port, () => {
  log(`server started on port ${config.port} (${config.env})`);
});
export default app;
