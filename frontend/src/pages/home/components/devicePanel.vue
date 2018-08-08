<template>
  <el-row class="device-list">
    <el-col 
      :lg="6" 
      :sm="12" 
      class="device-item"
      v-for="id in entity_ids"
      :key="id">
      <device-switch v-if="entities[id]" :entity="entities[id]" />
    </el-col>
  </el-row>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import DeviceSwitch from "@/components/DeviceSwitch/index.vue";
import { pluck, concat, unnest } from "ramda";

@Component({
  components: {
    DeviceSwitch
  }
})
export default class DevicePanel extends Vue {
  @Prop() devices;

  @Prop() entities;

  get entity_ids() {
    return concat(
      pluck("_id")(this.devices),
      unnest(pluck("entities")(this.devices))
    );
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

