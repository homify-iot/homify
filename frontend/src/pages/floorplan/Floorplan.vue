<template>
  <svg 
    viewBox="97.416 68 1660 600" 
    xmlns="http://www.w3.org/2000/svg" 
    xmlns:xlink="http://www.w3.org/1999/xlink">
    <base-layer>
      <control-layer v-if="floorplan.length" :floorplan="floorplan" :devices="devices"/>
    </base-layer>
  </svg>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { Devices } from "@/store/vuex-decorators";
import BaseLayer from "@/pages/floorplan/BaseLayer.vue";
import ControlLayer from "@/pages/floorplan/ControlLayer.vue";

@Component({
  components: {
    BaseLayer,
    ControlLayer
  }
})
export default class Floorplan extends Vue {
  @Devices.State("floorplan") floorplan;

  @Devices.State("devices") devices;

  @Devices.Action fetchFloorplan;

  created() {
    this.fetchFloorplan();
  }
}
</script>
<style lang="scss" scoped>
</style>
