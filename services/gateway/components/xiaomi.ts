import { loadPlatform } from "core";
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
    const info = {
      address: device.address,
    };
    if (metadata.types.has("miio:gateway")) {
      const DOMAIN = "xiaomi_aqara";
      ["switch", "sensor"].forEach((type) => {
        loadPlatform(type, DOMAIN, info);
      });
    } else {
      if (metadata.types.has("miio:power-strip")) {
        const type = "switch";
        const DOMAIN = "xiaomi_miio";
        loadPlatform(type, DOMAIN, info);
      }
    }
  });

  devices.on("unavailable", (device) => {
    log("unavailable", device);
  });
};
