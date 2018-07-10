import app from "./config/express";
import config from "./config/config";
import mongoose from "./config/db";
import MqttClient from "./services/mqtt.service";

export const mqtt = new MqttClient('ws://mqtt:9001', { clientId: 'gateway' + Math.floor(Date.now() / 1000) });

mongoose.connect(
  `mongodb://${config.db}:${config.db_port}/${config.db_name}`,
  { useNewUrlParser: true }
);

// listen on port config.port
app.listen(config.port, () => {
  console.info(`server started on port ${config.port} (${config.env})`);
});
export default app;
