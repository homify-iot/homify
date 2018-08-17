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
import "@/mqtt";
Vue.config.productionTip = false;
Vue.use(Element, {
  size: "medium" // set element-ui default size
});
import VueTimeago from 'vue-timeago';
Vue.use(VueTimeago);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
