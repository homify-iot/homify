import { mqttService } from "@/index"
import Entity from "platforms/_entity";
import { createDebug } from "services/debug.service";
const log = createDebug("Event bus")

export const broadcastStateChange = (entity: Entity, newState: boolean) => {
  const topic = `entity/${entity.entity_id}/state_changed`;
  log(topic, newState);
  return mqttService.publish(topic, JSON.stringify(newState))
}

export const serviceRegister = (entity_id: string) => {
  return mqttService.observe(`service/${entity_id}`)
}