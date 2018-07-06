<template>
  <section class="app-main">
    <transition name="fade" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view/>
      </keep-alive>
    </transition>
  </section>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { Tabs } from "@/store/vuex-decorators";

@Component
export default class AppMain extends Vue {
  @Tabs.State("cachedViews") cachedViews;
}
</script>

<style lang="scss" scoped>
.app-main {
  padding: 0 1.5rem 0.5rem;
}
</style>

