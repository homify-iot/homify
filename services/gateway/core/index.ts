import Homify from "./homify";


export const bootstrap = (config) => {
  const homify = new Homify();
  homify.config = config;

  config.discovery && discovery(config.discovery);
  return homify;
}

const discovery = (components) => {
  Object.keys(components).forEach(component => {
    const moduleName = `@/components/${component}`;
    const module = require(moduleName);
    module.setup(components[component]);
  });
}

export const load_platform = (type, domain, config) => {
  try {
    const moduleName = `@/platforms/${type}/${domain}`;
    const module = require(moduleName);
    module.setup_platform(config);
  } catch (e) {
    console.log(e);
  }
}
