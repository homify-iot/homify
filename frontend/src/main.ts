import Vue from "vue";
import App from "@/App.vue";
import router from "@/router";
import store from "@/store";
import Element from "element-ui";
import "@/styles/theme-chalk/index.scss";
import "@/styles/index.scss";
import * as svgicon from "vue-svgicon";

Vue.use(svgicon);
import "./assets/icons";
Vue.config.productionTip = false;
Vue.use(Element, {
  size: "medium" // set element-ui default size
});
import MqttClient from "@/services/mqtt.service";
export const mqtt = new MqttClient('ws://localhost:9001', { clientId: 'web' + Math.floor(Date.now() / 1000) });

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
