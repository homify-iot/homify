<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import DeviceSwitch from "@/components/DeviceSwitch/DeviceSwitch.vue";
import Modal from "@/components/Modal/Modal.vue";

@Component({
  components: {
    Modal,
    DeviceSwitch
  }
})
export default class InfoModal extends Vue {
  @Prop() statePool;

  @Prop() onlinePool;

  entity = {};

  open(entity) {
    this.entity = entity;
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
  </modal>
</template>

<style lang="scss">
</style>