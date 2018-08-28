<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import DeviceSwitch from "@/components/DeviceSwitch/DeviceSwitch.vue";
import Modal from "@/components/Modal/Modal.vue";
import LogChart from "@/components/LogChart/LogChart.vue";
import { Entities } from "@/store/vuex-decorators";

@Component({
  components: {
    Modal,
    DeviceSwitch,
    LogChart
  }
})
export default class InfoModal extends Vue {
  @Prop() statePool;

  @Prop() onlinePool;

  @Entities.Action fetchLogs;

  @Entities.State logs;

  entity: { name: string; entityId: string } = { name: "", entityId: "" };

  open(entity) {
    this.entity = entity;
    this.fetchLogs(entity.entityId);
    (this.$refs.modal as any).show();
  }
}
</script>

<template>
  <modal ref="modal">
    <div slot="header">{{ entity.name }}</div>
    <svgicon slot="right-icon" icon='settings'/>
    <device-switch 
      :entity="entity"
      :state-info="statePool[entity.entityId]"
      :online="onlinePool[entity.entityId]"/>
    <log-chart v-if="logs.length" :logs="logs"/>
  </modal>
</template>

<style lang="scss">
</style>