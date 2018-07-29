<template>
  <!-- <g class="control-layer" id="fp"/> -->
  <g>
    <component 
      :is="fp.tag" 
      v-for="(fp, index) in floorplan" 
      :key="index" 
      v-bind="fp.attributes"
      class="control-layer"
      :class="{'off': !(device(fp).state && device(fp).state.status)}"
      @click="updateDevice(device(fp))"/>
  </g>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { Devices } from "@/store/vuex-decorators";

@Component
export default class ControlLayer extends Vue {
  @Prop() floorplan;

  @Prop() devices;

  @Devices.Action updateDevice;

  get device() {
    return fp => this.devices.find(d => d._id === fp.device);
  }
}
</script>
<style lang="scss">
.control-layer {
  &:hover {
    cursor: pointer;
  }
  &.off {
    fill-opacity: 0;
  }
}
</style>
