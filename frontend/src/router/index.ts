import Vue from "vue";
import Router from "vue-router";
import Layout from "@/pages/layout/Layout.vue";
import Dashboard from "@/pages/dashboard/Dashboard.vue";
import Home from "@/pages/home/Home.vue";
import Floorplan from "@/pages/floorplan/Floorplan.vue";
import store from "@/store";
import { FETCH_ROUTES, ADD_TABS } from "@/store/event-types";

Vue.use(Router);

export const menuRoutes = [
  {
    path: "/dashboard",
    name: "dashboard",
    component: Dashboard,
    meta: { title: "Dashboard", icon: "dashboard", noCache: true }
  },
  {
    path: "/home/:roomName?",
    name: "home",
    component: Home,
    meta: { title: "My Home", icon: "home", noCache: true }
  },
  {
    path: "/floorplan",
    name: "floorplan",
    component: Floorplan,
    meta: { title: "Floorplan", icon: "floorplan", noCache: true }
  },
  {
    path: "/map",
    name: "map",
    meta: { title: "Map", icon: "google-maps", noCache: true }
  },
  {
    path: "/logbook",
    name: "logbook",
    meta: { title: "Logbook", icon: "calendar", noCache: true }
  },
  {
    path: "/history",
    name: "history",
    meta: { title: "History", icon: "chart-line", noCache: true }
  }
];
const mainRoutes = [
  {
    path: "",
    component: Layout,
    redirect: "/dashboard",
    children: menuRoutes
  }
];

const router = new Router({
  mode: "history",
  routes: [...mainRoutes]
});
router.beforeEach((to, {}, next) => {
  store.dispatch(ADD_TABS, to);
  store.dispatch(FETCH_ROUTES);
  next();
});
export default router;
