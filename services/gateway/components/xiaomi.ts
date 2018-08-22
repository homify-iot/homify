import Loader from "core/Loader";
import miio from "miio";
import { createDebug } from "services/debug.service";
const log = createDebug("Loading component");

export const setup = (config) => {
  log(config);
  const devices = miio.devices({
    cacheTime: config.cacheTime,
    skipSubDevices: true,
  });

  devices.on("available", (device) => {
    const metadata = device.device.metadata;
    if (metadata.types.has("miio:gateway")) {
      const DOMAIN = "xiaomi_aqara";
      if (device.device.matches("cap:children")) {
        const children = device.device.children();
        for (const child of children) {
          if (child.matches("type:wall-switch")) {
            Loader.loadPlatform("switch", DOMAIN, child);
          } else if (child.matches("type:sensor")) {
            Loader.loadPlatform("sensor", DOMAIN, child);
          }
        }
      }
    } else {
      if (metadata.capabilities.has("switchable-mode")) {
        const type = "switch";
        const DOMAIN = "xiaomi_miio";
        Loader.loadPlatform(type, DOMAIN, device.device);
      }
    }
  });

  devices.on("unavailable", (device) => {
    log("unavailable", device);
  });
};
