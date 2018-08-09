<template>
  <el-row class="device-list">
    <div 
      v-for="device in devices"
      :key="device._id">
      <div v-if="hasChildren(device)">
        <el-col 
          :lg="6" 
          :sm="12" 
          class="device-item"
          v-if="hasChildren(device)"
          v-for="(child,index) in device.children" 
          :key="index">
          <device-switch :device="child" />
        </el-col>
      </div>
      <el-col 
        v-else
        :lg="6" 
        :sm="12" 
        class="device-item">
        <device-switch :device="device" />
      </el-col>
    </div>
  </el-row>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import DeviceSwitch from "@/components/DeviceSwitch/index.vue";
import { length } from "ramda";

@Component({
  components: {
    DeviceSwitch
  }
})
export default class DevicePanel extends Vue {
  @Prop() devices;

  get hasChildren() {
    return device => length(device.children);
  }
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

