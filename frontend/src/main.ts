import Vue from "vue";
import App from "@/App.vue";
import router from "@/router";
import store from "@/store";
import "@/styles/index.scss";
import svgicon from "vue-svgicon";
Vue.use(svgicon);

import "./assets/icons";
import "@/mqtt";
import "./plugins/element.js";

import VueTimeago from "vue-timeago";
Vue.use(VueTimeago);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount("#app");
