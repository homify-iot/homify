<template>
  <div 
    class="app-wrapper" 
    :class="{hideSidebar: !sidebar.opened,
             withoutAnimation: sidebar.withoutAnimation,
             mobile: device === 'mobile'}">
    <navbar class="navbar fixed"/>
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="closeSideBar({ withoutAnimation: true })"/>
    <sidebar class="sidebar-container" :routes="routes" :sidebar="sidebar"/>
    <div class="main-container">
      <app-main/>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import Sidebar from "@/pages/layout/components/Sidebar/Sidebar.vue";
import Navbar from "@/pages/layout/components/Navbar.vue";
import Tabs from "@/pages/layout/components/Tabs.vue";
import AppMain from "@/pages/layout/components/AppMain.vue";
import { Permission, Settings, Devices } from "@/store/vuex-decorators";

@Component({
  components: {
    Sidebar,
    Navbar,
    Tabs,
    AppMain
  }
})
export default class Layout extends Vue {
  @Permission.State("routes") routes;

  @Settings.State("sidebar") sidebar;

  @Settings.State("device") device;

  @Settings.Action toggleDevice;

  @Settings.Action closeSideBar;

  @Devices.Action fetchRooms;

  @Watch("$route")
  routeChange() {
    if (this.device === "mobile" && this.sidebar.opened) {
      this.closeSideBar({ withoutAnimation: false });
    }
  }

  WIDTH = 1024;

  RATIO = 3;

  created() {
    this.fetchRooms();
  }

  beforeMount() {
    window.addEventListener("resize", this.resizeHandler);
  }

  mounted() {
    if (this.isMobile()) {
      this.toggleDevice("mobile");
      this.closeSideBar({ withoutAnimation: true });
    }
  }

  isMobile() {
    const rect = document.body.getBoundingClientRect();
    return rect.width - this.RATIO < this.WIDTH;
  }

  resizeHandler() {
    if (!document.hidden) {
      const isMobile = this.isMobile();
      this.toggleDevice(isMobile ? "mobile" : "desktop");

      if (isMobile) {
        this.closeSideBar({ withoutAnimation: true });
      }
    }
  }
}
</script>

