import homify from "core/homify";
import { EntityObject } from "platforms/_entity";
import { createDebug } from "services/debug.service";
import { StateInfo } from "types/homify";

const log = createDebug("EventBus");

export default class EventBus {
  public static broadcastStateChange = (entityId: string, stateInfo: StateInfo) => {
    const topic = `entity/${entityId}/state_changed`;
    log(topic, stateInfo);
    return homify.mqttService.publish(topic, JSON.stringify(stateInfo));
  }

  public static broadcastEntitiesChange = (entities: any[]) => {
    const topic = `entity/entities_changed`;
    log(topic);
    return homify.mqttService.publish(topic, JSON.stringify(entities));
  }

  public static broadcastNewDeviceFound = (entity: EntityObject) => {
    const topic = `entity/new_device_found`;
    log("Found new device! ", entity);
    return homify.mqttService.publish(topic, JSON.stringify(entity));
  }

  public static broadcastComponentLoaded = (entityId: string) => {
    const topic = `entity/component_loaded`;
    log(entityId + " loaded");
    return homify.mqttService.publish(topic, JSON.stringify(true));
  }

  public static serviceRegister = (entityId: string) => {
    return homify.mqttService.observe(`service/${entityId}`);
  }

  public static callService = (entityId: string, service: string) => {
    const topic = `service/${entityId}`;
    return homify.mqttService.publish(topic, JSON.stringify(service));
  }

  public static getStateListener = (entityId: string) => {
    return homify.mqttService.observe(`entity/${entityId}/state_changed`);
  }
}


