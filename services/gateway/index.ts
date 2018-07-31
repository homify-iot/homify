import app from "./config/express";
import config from "./config/config";
import mongoose from "./config/db";
import MqttClient from "./services/mqtt.service";
import { registerAllControllers } from "./services/overload.service";
import { Devices } from "./config/db";

export const mqttService = new MqttClient();
mqttService.observe("devices/#");

Devices.find({})
  .populate("type")
  .exec()
  .then(registerAllControllers);

mongoose.connect(
  `mongodb://${config.db}:${config.db_port}/${config.db_name}`,
  {
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 500
  }
);

// listen on port config.port
app.listen(config.port, () => {
  console.info(`server started on port ${config.port} (${config.env})`);
});
export default app;
