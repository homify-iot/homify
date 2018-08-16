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

mqttClient.observe("entity/entities_changed")
  .subscribe((packet: IMqttMessage) => {
    const entities = JSON.parse(packet.payload.toString());
    store.commit("entities/setEntities", entities);
  })


export const callService = (entity, service) => {
  const topic = `service/${entity.entity_id}`;
  return mqttClient.publish(topic, JSON.stringify(service));
}


export const updateDevice = device => {
  const topic = `devices/${device._id}/update`;
  const target = Object.assign({}, device.state, {
    status: !device.state || !device.state.status
  });
  mqttClient.unsafePublish(topic, JSON.stringify(target));
};
