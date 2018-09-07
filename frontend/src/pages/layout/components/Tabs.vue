<template>
  <el-tabs 
    :value="$route.path" 
    type="card"
    closable 
    @tab-click="clickTab"
    @tab-remove="removeTab"
  >
    <el-tab-pane
      v-for="item in visitedTabs"
      :key="item.path"
      :label="item.title"
      :name="item.path"
    />
  </el-tabs>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { Tabs } from "@/store/vuex-decorators";

@Component
export default class Layout extends Vue {
  @Tabs.State("visitedTabs") visitedTabs;

  @Tabs.Action delTab;

  clickTab({ name }) {
    this.$router.push(name);
  }

  removeTab(tabName) {
    const tabIndex = this.visitedTabs.findIndex(tab => tab.path === tabName);
    this.delTab(tabName);
    if (tabName === this.$route.path) {
      const length = this.visitedTabs.length;
      const nextIndex = tabIndex < length ? tabIndex : tabIndex - 1;
      const nextPath = this.visitedTabs[nextIndex]
        ? this.visitedTabs[nextIndex].path
        : "/";
      this.$router.push(nextPath);
    }
  }
}
</script>

