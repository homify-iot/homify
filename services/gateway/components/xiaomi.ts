import miio from "miio";
import { load_platform } from "core";

export const setup = (config) => {
  console.log('loading', config);
  const devices = miio.devices({
    cacheTime: config.cacheTime,
    skipSubDevices: true
  });

  devices.on('available', device => {
    const metadata = device.device.metadata;
    if (metadata.types.has("miio:gateway")) {
      const DOMAIN = "xiaomi_aqara";
      if (device.device.matches("cap:children")) {
        const children = device.device.children();
        for (const child of children) {
          if (child.matches("type:wall-switch")) {
            load_platform("switch", DOMAIN, child);
          }
        }
      };
    } else {
      if (metadata.capabilities.has("switchable-mode")) {
        const type = "switch";
        const DOMAIN = "xiaomi_miio";
        load_platform(type, DOMAIN, device.device);
      }

    }
  });

  devices.on('unavailable', device => {
    console.log(2, device);
    // Device is no longer available and is destroyed
  });
}