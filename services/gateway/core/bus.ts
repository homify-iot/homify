import { mqttService } from "@/index";
import { createDebug } from "services/debug.service";
const log = createDebug("Event bus");


export const broadcastStateChange = (entityId: string, newState: boolean) => {
  const topic = `entity/${entityId}/state_changed`;
  log(topic, newState);
  return mqttService.publish(topic, JSON.stringify(newState));
};

export const broadcastEntitiesChange = (entities: any[]) => {
  const topic = `entity/entities_changed`;
  log(topic);
  return mqttService.publish(topic, JSON.stringify(entities));
};

export const serviceRegister = (entityId: string) => {
  return mqttService.observe(`service/${entityId}`);
};

export const callService = (entityId: string, service: string) => {
  const topic = `service/${entityId}`;
  return mqttService.publish(topic, JSON.stringify(service));
};

export const getStateListener = (entityId: string) => {
  return mqttService.observe(`entity/${entityId}/state_changed`);
};
