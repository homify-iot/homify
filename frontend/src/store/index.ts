import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

import { permission } from "./modules/permission";
import { tabs } from "./modules/tabs";
import { settings } from "./modules/settings";
import { entities } from "@/store/modules/entities";
import { modal } from "@/store/modules/modal";
export default new Vuex.Store({
  modules: {
    permission,
    tabs,
    settings,
    entities,
    modal
  }
});
