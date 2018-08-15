import app from "./config/express";
import config from "./config/config";
import MqttClient from "./services/mqtt.service";
import { bootstrap } from "./core"

export const mqttService = new MqttClient();

export const homify = bootstrap(config.homify_config);

// listen on port config.port
app.listen(config.port, () => {
  console.info(`server started on port ${config.port} (${config.env})`);
});
export default app;
