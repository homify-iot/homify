import config from "config/config";
import { Automations, Entities } from "config/db";
import * as EventBus from "core/EventBus";
import * as Loader from "core/Loader";
import Entity from "platforms/_entity";
import MqttClient from "services/mqtt.service";
import { OnlinePool, StatePool } from "types/homify";

class Homify {
  public config;
  public mqttService: MqttClient;
  public automationCache: any[];
  public statePool: StatePool = {};
  public onlinePool: OnlinePool = {};
  constructor() {
    this.config = config.homify_config;
    this.mqttService = new MqttClient();
  }

  public async bootstrap() {
    this.automationCache = await Automations.find();
    Loader.discoveryComponents(this.config.discovery);
    Loader.loadAutomation(this.automationCache);
  }

  public async addComponent(device: Entity) {
    device.register();
    let existEntity = await Entities.findOne({ entityId: device.entityId });
    if (!existEntity) {
      existEntity = await Entities.create(device.toObject());
      await EventBus.broadcastNewDeviceFound(device.toObject());
    }
    device.name = existEntity.name;
    await EventBus.broadcastComponentLoaded(device.entityId);
    this.onlinePool[device.entityId] = true;
  }
}

export default new Homify();
