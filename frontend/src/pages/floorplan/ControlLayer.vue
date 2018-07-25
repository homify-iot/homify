<template>
  <!-- <g class="control-layer" id="fp"/> -->
  <g>
    <component 
      :is="fp.tag" 
      v-for="(fp, index) in floorplan" 
      :key="index" 
      v-bind="fp.attributes"
      class="control-layer"
      :class="{'off': !(fp.device.state && fp.device.state.status)}"
      @click="updateDevice(fp.device)"/>
  </g>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { Devices } from "@/store/vuex-decorators";

@Component
export default class ControlLayer extends Vue {
  @Prop() floorplan;

  @Devices.Action updateDevice;

  mounted() {
    // const group = SVG("fp");
    // this.floorplan.forEach(fp => {
    //   const elm = group[fp.tag]().attr(fp.attributes);
    //   if (!fp.device.state.status) elm.addClass("off");
    //   elm.click(() => {
    //     this.updateDevice(fp.device);
    //   });
    // });
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
