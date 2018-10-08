import { createDebug } from "services/debug.service";

const log = createDebug("Loader");

export const discoveryComponents = (discoveryCache) => {
  discoveryCache.forEach((component) => {
    const moduleName = `@/components/${component.name}`;
    const module = require(moduleName);
    module.setup(component);
  });
};

export const loadAutomation = (jobs) => {
  try {
    jobs.forEach((job) => {
      const moduleName = `@/components/automation`;
      const module = new (require(moduleName).default)(job);
      module.start();
    });
  } catch (e) {
    log(e);
  }
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


