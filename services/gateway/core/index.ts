import { Devices } from "config/db";
import Homify from "core/homify";
import { createDebug } from "services/debug.service";

const log = createDebug("core");

export const bootstrap = (config) => {
  const homify = new Homify(config);
  discoveryComponents();
  loadAutomation(config.automation || []);
  return homify;
};

const discoveryComponents = () => {
  Devices.find({})
    .exec()
    .then((components) => {
      console.log(components);
      // components.forEach((component) => {
      //   const moduleName = `@/components/${component.name}`;
      //   const module = require(moduleName);
      //   module.setup(component);
      // });
    });
};

export const loadAutomation = (jobs) => {
  jobs.forEach((job) => {
    const moduleName = `@/components/automation`;
    const module = new (require(moduleName).default)(job);
    module.start();
  });
};

export const loadPlatform = (type, domain, config) => {
  try {
    const moduleName = `@/platforms/${type}/${domain}`;
    const module = require(moduleName);
    module.setupPlatform(config);
  } catch (e) {
    log(e);
  }
};
