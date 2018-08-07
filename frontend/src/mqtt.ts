import MqttClient from "@/services/mqtt.service";
import { IMqttMessage } from "@/types/mqtt.model";
import store from "@/store";
import { UPDATE_DEVICE_STATE } from "@/store/event-types";
import { merge } from "rxjs";

export const mqttClient = new MqttClient();
mqttClient.observe("devices/#");
merge(
  mqttClient.getStreaming()("response"),
  mqttClient.getStreaming()("health_check")
).subscribe((packet: IMqttMessage) => {
  const { topic, payload } = packet;
  const value = JSON.parse(payload.toString());
  const [{}, _id, action] = topic.split("/");
  let device;
  if (action === "response") {
    device = { _id, state: value };
  } else if (action === "health_check") {
    device = { _id, online: value };
  }
  store.dispatch(UPDATE_DEVICE_STATE, device);
});

export const updateDevice = device => {
  const topic = `devices/${device._id}/update`;
  const target = Object.assign({}, device.state, {
    status: !device.state.status
  });
  mqttClient.unsafePublish(topic, JSON.stringify(target));
};
