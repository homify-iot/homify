import { Logs } from "config/db";
import Entity from "platforms/_entity";

export default class Logger {
  public static async logToDB(category: string, entity: Entity, details: string) {
    await Logs.create({ category, entityId: entity.entityId, entityName: entity.name, details });
  }
}
