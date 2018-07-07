<template>
  <el-row class="device-list">
    <el-col 
      :lg="6" 
      :sm="12" 
      class="device-item"
      v-for="(device,index) in devices"
      :key="index">
      <device-switch :device="device" />
    </el-col>
  </el-row>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import DeviceSwitch from "@/components/DeviceSwitch/index.vue";

@Component({
  components: {
    DeviceSwitch
  }
})
export default class DevicePanel extends Vue {
  @Prop() devices;
}
</script>

<style lang="scss" scoped>
.device-list {
  padding-left: 6.5rem;
  width: 100%;
  .device-item {
    padding: 0 10px;
  }
}
</style>

