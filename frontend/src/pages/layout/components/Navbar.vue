<template>
  <div>
    <hamburger class="hamburger-container" :toggle-click="toggleSideBar" :is-active="sidebar.opened"/>

    <tabs class="tabs"/>

    <div class="right-menu">
      <el-dropdown class="avatar-container right-menu-item" trigger="click">
        <div class="avatar-wrapper">
          <img class="user-avatar" src="https://avatars2.githubusercontent.com/u/15620651?s=460&v=4">
          <i class="el-icon-caret-bottom"/>
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/">
            <el-dropdown-item>
              Dashboard
            </el-dropdown-item>
          </router-link>
          <a target='_blank' href="https://github.com/PanJiaChen/vue-element-admin/">
            <el-dropdown-item>
              Github
            </el-dropdown-item>
          </a>
          <el-dropdown-item divided>
            <span style="display:block;">LogOut</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Hamburger from "@/components/Hamburger/Hamburger.vue";
import { Settings } from "@/store/vuex-decorators";
import Tabs from "@/pages/layout/components/Tabs.vue";
@Component({
  components: {
    Hamburger,
    Tabs
  }
})
export default class Navbar extends Vue {
  @Settings.State("sidebar") sidebar;

  @Settings.Action toggleSideBar;
}
</script>
