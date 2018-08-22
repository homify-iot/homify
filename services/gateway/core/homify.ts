import config from "config/config";
import { Automations, Entities } from "config/db";
import EventBus from "core/EventBus";
import Loader from "core/Loader";
import { default as Entity, EntityObject } from "platforms/_entity";
import { Subject } from "rxjs";
import { debounceTime, distinctUntilChanged, map, switchMap } from "rxjs/operators";
import { createDebug } from "services/debug.service";
import MqttClient from "services/mqtt.service";

const log = createDebug("Homify");

class Homify {
  public get entities(): EntityObject[] {
    return this.components.map((c) => c.toObject());
  }
  public config;
  public mqttService: MqttClient;
  public components: Entity[];
  public entityCache: EntityObject[];
  public automationCache: any[];
  public publc; private onUpdate$: Subject<Entity[]> = new Subject();
  constructor() {
    this.config = config.homify_config;
    this.mqttService = new MqttClient();
    this.components = this.createProxy();
    this.listenComponents();
  }

  public async bootstrap() {
    this.entityCache = await Entities.find();
    this.automationCache = await Automations.find();
    Loader.discoveryComponents(this.config.discovery);
    Loader.loadAutomation(this.automationCache);
  }
  public async addComponent(device) {
    device.register();
    if (!this.getEntityById(device.entityId)) {
      log("Found new device! ", device);
    }
    this.components.push(device);
  }

  public getEntityById(entityId: string) {
    return this.entityCache.find((e) => e.entityId === entityId);
  }

  private createProxy() {
    return new Proxy([], {
      set: (target, property, entity) => {
        target[property] = entity;
        this.onUpdate$.next(target);
        return true;
      },
    });
  }

  private listenComponents() {
    this.onUpdate$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      map((components) => components.map((c) => c.toObject())),
      switchMap(EventBus.broadcastEntitiesChange),
    ).subscribe();
  }
}
export default new Homify();
