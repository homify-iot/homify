import MqttClient from "@/services/mqtt.service";
import { IMqttMessage } from "@/types/mqtt.model";
import store from "@/store";

export const mqttClient = new MqttClient();
mqttClient.observe("entity/+/state_changed")
  .subscribe((packet: IMqttMessage) => {
    const { topic, payload } = packet;
    const [, entity_id] = topic.split("/");
    const newState = JSON.parse(payload.toString());
    store.commit("entities/setState", { entity_id, newState });
  })

// merge(
//   mqttClient.getStreaming()("response"),
//   mqttClient.getStreaming()("health_check")
// ).subscribe((packet: IMqttMessage) => {
//   const { topic, payload } = packet;
//   const value = JSON.parse(payload.toString());
//   const [{ }, _id, action] = topic.split("/");
//   let device;
//   if (action === "response") {
//     device = { _id, state: value };
//   } else if (action === "health_check") {
//     device = { _id, online: value };
//   }
//   store.dispatch(UPDATE_DEVICE_STATE, device);
// });

export const callService = (entity, service) => {
  const topic = `service/${entity.entity_id}`;
  return mqttClient.publish(topic, JSON.stringify(service));
}

// export const registerStateObserver = () => {
//   mqttClient.observe("components")
//     .subscribe((packet: IMqttMessage) => {
//       const { topic, payload } = packet;
//       const value = JSON.parse(payload.toString());
//       console.log(value);
//     })
//   return mqttClient.observe(`entity/${entity.entity_id}/state_changed`)
// }


export const updateDevice = device => {
  const topic = `devices/${device._id}/update`;
  const target = Object.assign({}, device.state, {
    status: !device.state || !device.state.status
  });
  mqttClient.unsafePublish(topic, JSON.stringify(target));
};
