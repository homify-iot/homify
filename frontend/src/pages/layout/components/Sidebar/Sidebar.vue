<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <el-menu
      mode="vertical"
      :show-timeout="200"
      :default-active="$route.name"
      :collapse="!sidebar.opened"
    >
      <sidebar-item :routes="routes" />
    </el-menu>
  </el-scrollbar>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import SidebarItem from "./SidebarItem.vue";

@Component({
  components: { SidebarItem }
})
export default class Sidebar extends Vue {
  @Prop() routes;

  @Prop() sidebar;
}
</script>
