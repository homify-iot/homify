import { createDebug } from "services/debug.service";
import config from "./config/config";
import app from "./config/express";
import { bootstrap } from "./core";
import MqttClient from "./services/mqtt.service";

export const mqttService = new MqttClient();

export const homify = bootstrap(config.homify_config);

const log = createDebug("Server");

app.listen(config.port, () => {
  log(`server started on port ${config.port} (${config.env})`);
});
export default app;
