<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import DeviceSwitch from "@/components/DeviceSwitch/DeviceSwitch.vue";
import ModalMobile from "@/components/Modal/Modal.mobile.vue";
import ModalDesktop from "@/components/Modal/Modal.desktop.vue";
import BarChartLog from "@/components/LogChart/BarChartLog.vue";
import LineChartLog from "@/components/LogChart/LineChartLog.vue";
import { Entities, Settings, Modal } from "@/store/vuex-decorators";

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

  @Modal.State info;

  @Modal.Getter entity;

  @Modal.Mutation toggleModal;

  created() {
    this.fetchLogs(this.entity.entityId);
  }
}
</script>

<template>
  <component 
    :is="isMobile ? 'modal-mobile' : 'modal-desktop'" 
    :visible="info.visible" 
    @visible-change="(visible) => toggleModal({name:'info',visible})"
  >
    <svgicon slot="left-icon" icon='left' @click="toggleModal({name:'info'})" />
    <div slot="header">{{ entity.name }}</div>
    <svgicon slot="right-icon" icon='settings' @click="toggleModal({name:'settings'})" />
    <device-switch 
      :entity="entity"
      :state-info="statePool[entity.entityId]"
      :online="onlinePool[entity.entityId]"
    />
    <component 
      v-if="!loadingLogs" 
      :is="entity.type === 'switch' || entity.type === 'binarySensor' ? 'bar-chart-log': 'line-chart-log'" 
      :log="logs[entity.entityId]"
      :type="entity.type"
    />
  </component>
</template>