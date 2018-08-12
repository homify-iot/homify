import app from "./config/express";
import config from "./config/config";
import MqttClient from "./services/mqtt.service";
import { bootstrap } from "./core"
import { map } from "rxjs/operators";

export const mqttService = new MqttClient();
mqttService.observe("devices/#");

mqttService.observables["devices/#"].subscribe(packet => {
  const { topic, payload } = packet;
  const state = JSON.parse(payload.toString());
  console.log(topic, state);
});

export const homify = bootstrap(config.homify_config);
homify.components$
  .pipe(
    map(components => components.map(c => ({
      id: c.id,
      name: c.name
    })))
  )
  .subscribe(res => {
    console.log(123, res);
    mqttService
      .unsafePublish("components", JSON.stringify(res))
  })

// listen on port config.port
app.listen(config.port, () => {
  console.info(`server started on port ${config.port} (${config.env})`);
});
export default app;
