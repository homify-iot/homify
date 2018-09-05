<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import DeviceSwitch from "@/components/DeviceSwitch/DeviceSwitch.vue";
import ModalMobile from "@/components/Modal/Modal.mobile.vue";
import ModalDesktop from "@/components/Modal/Modal.desktop.vue";
import BarChartLog from "@/components/LogChart/BarChartLog.vue";
import LineChartLog from "@/components/LogChart/LineChartLog.vue";
import { Entities, Settings } from "@/store/vuex-decorators";

@Component({
  components: {
    ModalMobile,
    ModalDesktop,
    DeviceSwitch,
    BarChartLog,
    LineChartLog
  }
})
export default class InfoModal extends Vue {
  @Prop() statePool;

  @Prop() onlinePool;

  @Entities.Action fetchLogs;

  @Entities.State logs: {};

  @Entities.State loadingLogs: boolean;

  @Settings.Getter isMobile;

  entity: { name: string; entityId: string; type: string } = {
    name: "",
    entityId: "",
    type: ""
  };

  open(entity) {
    this.entity = entity;
    this.fetchLogs(entity.entityId);
    (this.$refs.modal as any).show();
  }
}
</script>

<template>
  <component ref="modal" :is="isMobile ? 'modal-mobile' : 'modal-desktop'">
    <div slot="header">{{ entity.name }}</div>
    <svgicon slot="right-icon" icon='settings'/>
    <device-switch 
      :entity="entity"
      :state-info="statePool[entity.entityId]"
      :online="onlinePool[entity.entityId]"/>
    <component 
      v-if="!loadingLogs" 
      :is="entity.type === 'switch' || entity.type === 'binarySensor' ? 'bar-chart-log': 'line-chart-log'" 
      :log="logs[entity.entityId]"
      :type="entity.type"/>
  </component>
</template>

<style lang="scss">
</style>