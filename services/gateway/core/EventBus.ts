import homify from "core/homify";
import Logger from "core/Logger";
import { default as Entity, EntityObject } from "platforms/_entity";
import { createDebug } from "services/debug.service";
import { StateInfo } from "types/homify";

const log = createDebug("EventBus");

export const broadcastStateChange = (entity: Entity, stateInfo: StateInfo) => {
  const topic = `entity/${entity.entityId}/state_changed`;
  log(topic, stateInfo);
  Logger.logToDB("state_changed", entity, JSON.stringify(stateInfo));
  return homify.mqttService.publish(topic, JSON.stringify(stateInfo));
};

export const broadcastEntitiesChange = (entities: any[]) => {
  const topic = `entity/entities_changed`;
  log(topic);
  return homify.mqttService.publish(topic, JSON.stringify(entities));
};

export const broadcastNewDeviceFound = (entity: EntityObject) => {
  const topic = `entity/new_device_found`;
  log("Found new device! ", entity);
  return homify.mqttService.publish(topic, JSON.stringify(entity));
};

export const broadcastComponentLoaded = (entityId: string) => {
  const topic = `entity/component_loaded`;
  log(entityId + " loaded");
  return homify.mqttService.publish(topic, JSON.stringify(true));
};

export const serviceRegister = (entityId: string) => {
  return homify.mqttService.observe(`service/${entityId}`);
};

export const callService = (entityId: string, service: string) => {
  const topic = `service/${entityId}`;
  return homify.mqttService.publish(topic, JSON.stringify(service));
};

export const getStateListener = (entityId: string) => {
  return homify.mqttService.observe(`entity/${entityId}/state_changed`);
};


