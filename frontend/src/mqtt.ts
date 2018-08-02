import MqttClient from "@/services/mqtt.service";
import { IMqttMessage } from "@/types/mqtt.model";
import store from "@/store";
import { UPDATE_DEVICE_STATE } from "@/store/event-types";

export const mqttClient = new MqttClient();
mqttClient.observe("devices/+/response");
mqttClient
  .getStreaming()("response")
  .subscribe((packet: IMqttMessage) => {
    const { topic, payload } = packet;
    const state = JSON.parse(payload.toString());
    const [{}, _id] = topic.split("/");
    const device = {
      _id,
      state
    };
    store.dispatch(UPDATE_DEVICE_STATE, device);
  });

export const updateDevice = device => {
  const topic = `devices/${device._id}/update`;
  const target = Object.assign({}, device.state, {
    status: !device.state.status
  });
  mqttClient.unsafePublish(topic, JSON.stringify(target));
};
