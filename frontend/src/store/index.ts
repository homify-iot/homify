import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

import { permission } from "./modules/permission";
import { tabs } from "./modules/tabs";
import { settings } from "./modules/settings";
import { rooms } from "@/store/modules/rooms";
import { devices } from "@/store/modules/devices";

export default new Vuex.Store({
  modules: {
    permission,
    tabs,
    settings,
    rooms,
    devices
  }
});
