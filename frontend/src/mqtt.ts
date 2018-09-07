import MqttClient from "@/services/mqtt.service";
import store from "@/store";
import { IMqttMessage } from "@/types/mqtt.model";

export const mqttClient = new MqttClient();
mqttClient.observe("entity/+/state_changed")
  .subscribe((packet: IMqttMessage) => {
    const { topic, payload } = packet;
    const [, entityId] = topic.split("/");
    const newState = JSON.parse(payload.toString());
    store.commit("entities/setState", { entityId, newState });
  });

mqttClient.observe("entity/entities_changed")
  .subscribe((packet: IMqttMessage) => {
    const entities = JSON.parse(packet.payload.toString());
    store.commit("entities/setEntities", entities);
  });

export const callService = (entityId: string, service: string) => {
  const topic = `service/${entityId}`;
  return mqttClient.publish(topic, JSON.stringify(service));
};

export const updateDevice = device => {
  const topic = `devices/${device._id}/update`;
  const target = Object.assign({}, device.state, {
    status: !device.state || !device.state.status,
  });
  mqttClient.unsafePublish(topic, JSON.stringify(target));
};
