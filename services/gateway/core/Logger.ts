import { Logs } from "config/db";
import Entity from "platforms/_entity";
import { createDebug } from "services/debug.service";

const log = createDebug("Log Error:");

export default class Logger {
  public static async logToDB(category: string, entity: Entity, details: string) {
    try {
      await Logs.create({ category, entityId: entity.entityId, entityName: entity.name, details });
    } catch (e) {
      log(e);
    }
  }
}
