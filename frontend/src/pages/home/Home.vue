<template>
  <div class="home-layout">
    <el-card class="group-card" v-for="group in groups" :key="group">
      <div slot="header">
        <span class="card-title">{{ group }}</span>
        <el-button style="float: right; padding: 3px 0" type="text">...</el-button>
      </div>
      <el-row class="device-list">
        <el-col 
          :lg="6" 
          :sm="12" 
          class="device-item"
          v-for="entity in grouped[group]"
          :key="entity.entityId">
          <device-switch v-if="entity" :entity="entity" />
        </el-col>
      </el-row>
    </el-card>
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
  @Entities.State grouped;

  get groups() {
    return Object.keys(this.grouped);
  }
}
</script>

<style lang="scss" scoped>
.home-layout {
  .group-card {
    margin-bottom: 1rem;
    .card-title {
      text-transform: capitalize;
    }
  }
  .device-list {
    width: 100%;
    .device-item {
      padding: 0 10px;
    }
  }
}
</style>


