<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import DeviceSwitch from "@/components/DeviceSwitch/DeviceSwitch.vue";
import ModalMobile from "@/components/Modal/Modal.mobile.vue";
import ModalDesktop from "@/components/Modal/Modal.desktop.vue";
import LogChart from "@/components/LogChart/LogChart.vue";
import { Entities, Settings } from "@/store/vuex-decorators";

@Component({
  components: {
    ModalMobile,
    ModalDesktop,
    DeviceSwitch,
    LogChart
  }
})
export default class InfoModal extends Vue {
  @Prop() statePool;

  @Prop() onlinePool;

  @Entities.Action fetchLogs;

  @Entities.State logs: {};

  @Entities.State loadingLogs: boolean;

  @Settings.Getter isMobile;

  entity: { name: string; entityId: string } = { name: "", entityId: "" };

  open(entity) {
    this.entity = entity;
    this.fetchLogs(entity.entityId);
    (this.$refs.modal as any).show();
  }

  get dataset() {
    const id = this.entity.entityId,
      log = this.logs[id];
    if (!log) return;
    const data = log.map(set => {
      const state = JSON.parse(set.details);
      return [new Date(state.last_update), state.state ? 1 : 0];
    });
    return [
      {
        interval_s: 0,
        data: [...data]
      }
    ];
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
    <log-chart v-if="!loadingLogs" :dataset="dataset"/>
  </component>
</template>

<style lang="scss">
</style>