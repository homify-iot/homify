import { createDebug } from "services/debug.service";
import Homify from "./homify";

const log = createDebug("core");

export const bootstrap = (config) => {
  const homify = new Homify();
  homify.config = config;

  discovery(config.discovery || []);
  loadAutomation(config.automation || []);
  return homify;
};

const discovery = (components) => {
  components.forEach((component) => {
    const moduleName = `@/components/${component.name}`;
    const module = require(moduleName);
    module.setup(component);
  });
};

const loadAutomation = (jobs) => {
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
