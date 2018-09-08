<template>
  <div class="menu-wrapper">
    <template v-for="(item,index) in routes">
      <router-link
        :key="index"
        :to="path(item)"
      >
        <el-menu-item :index="item.name">
          <svgicon 
            v-if="item.meta&&item.meta.icon" 
            :icon="item.meta.icon" 
            width="36" 
            height="36" 
            :original="true"
          />
          <span v-if="item.meta&&item.meta.title" slot="title">{{ item.meta.title }}</span>
        </el-menu-item>
      </router-link>
    </template>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { Tabs } from "@/store/vuex-decorators";

@Component
export default class SidebarItem extends Vue {
  @Prop() routes;

  @Tabs.State("visitedTabs") visitedTabs;

  get path() {
    return item => {
      const visited = this.visitedTabs.find(v => v.name === item.name);
      return visited ? visited.path : { name: item.name };
    };
  }
}
</script>