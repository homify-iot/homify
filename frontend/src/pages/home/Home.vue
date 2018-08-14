<template>
  <div class="home-layout">
    <el-row class="device-list">
      <el-col 
        :lg="6" 
        :sm="12" 
        class="device-item"
        v-for="entity in entities"
        :key="entity.entity_id">
        <device-switch v-if="entity" :entity="entity" />
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { Entities } from "@/store/vuex-decorators";
import DeviceSwitch from "@/components/DeviceSwitch/index.vue";

@Component({
  components: {
    DeviceSwitch
  }
})
export default class Home extends Vue {
  @Entities.State entities;
}
</script>

<style lang="scss" scoped>
.home-layout {
  display: flex;
  .device-list {
    width: 100%;
    .device-item {
      padding: 0 10px;
    }
  }
}
</style>


