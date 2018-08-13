import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

import { permission } from "./modules/permission";
import { tabs } from "./modules/tabs";
import { settings } from "./modules/settings";
import { devices } from "@/store/modules/devices";
import { entities } from "@/store/modules/entities";
export default new Vuex.Store({
  modules: {
    permission,
    tabs,
    settings,
    devices,
    entities
  }
});
