import app from "./config/express";
import config from "./config/config";
import mongoose from "./config/db";
import MqttClient from "./services/mqtt.service";
import Overload from "./services/overload.service";
import { Devices } from "./config/db";

export const mqttService = new MqttClient();
mqttService.observe("devices/#");
mqttService.observables["devices/#"].subscribe(packet => {
  const { topic, payload } = packet;
  const state = JSON.parse(payload.toString());
  console.log(topic, state);
});

const registerAllControllers = devices => {
  devices.forEach(d => new Overload(d));
};
Devices.find({})
  .populate("type")
  .exec()
  .then(registerAllControllers);

const connectWithRetry = () => {
  console.log("MongoDB connection with retry");
  mongoose
    .connect(`mongodb://${config.db}:${config.db_port}/${config.db_name}`)
    .then(() => {
      console.log("MongoDB is connected");
    })
    .catch(err => {
      console.log(err);
      setTimeout(connectWithRetry, 5000);
    });
};

connectWithRetry();

// listen on port config.port
app.listen(config.port, () => {
  console.info(`server started on port ${config.port} (${config.env})`);
});
export default app;
