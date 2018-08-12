import miio from "miio";
import { load_platform } from "core";

const DOMAIN = "xiaomi_miio"

export const setup = (config) => {
  console.log('loading', config);
  const devices = miio.devices({
    cacheTime: config.cacheTime,
    skipSubDevices: true // 5 minutes. Default is 1800 seconds (30 minutes)
  });

  devices.on('available', device => {
    const metadata = device.device.metadata;
    if (metadata.types.has("miio:gateway")) {
    } else {
      if (metadata.capabilities.has("switchable-mode")) {
        const info = {
          id: device.id,
          host: device.address,
          port: device.port,
          token: device.token,
          model: device.device.miioModel
        }
        load_platform("switch", DOMAIN, info);
      }

    }
  });

  devices.on('unavailable', device => {
    console.log(2, device);
    // Device is no longer available and is destroyed
  });
}