import homify from "core/homify";
import { createDebug } from "services/debug.service";
const log = createDebug("EventBus");

export default class EventBus {
  public static broadcastStateChange = (entityId: string, newState: boolean) => {
    const topic = `entity/${entityId}/state_changed`;
    log(topic, newState);
    return homify.mqttService.publish(topic, JSON.stringify(newState));
  }

  public static broadcastEntitiesChange = (entities: any[]) => {
    const topic = `entity/entities_changed`;
    log(topic);
    return homify.mqttService.publish(topic, JSON.stringify(entities));
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


