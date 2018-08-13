import { mqttService } from "@/index"
import Entity from "platforms/_entity";

export const broadcastStateChange = (entity: Entity, newState: any) => {
  return mqttService.publish(`entity/${entity.entity_id}/state_changed`, JSON.stringify(newState))
}

export const serviceRegister = (entity_id: string) => {
  return mqttService.observe(`services/${entity_id}`)
}