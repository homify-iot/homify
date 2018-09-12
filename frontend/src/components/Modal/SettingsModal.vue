<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import ModalMobile from "@/components/Modal/Modal.mobile.vue";
import ModalDesktop from "@/components/Modal/Modal.desktop.vue";
import { Settings, Modal } from "@/store/vuex-decorators";

@Component({
  components: {
    ModalMobile,
    ModalDesktop
  }
})
export default class SettingsModal extends Vue {
  @Settings.Getter isMobile;

  @Modal.State settings;

  @Modal.Mutation toggleModal;
}
</script>

<template>
  <component :is="isMobile ? 'modal-mobile' : 'modal-desktop'" :visible="settings.visible">
    <div slot="left-icon" icon='left' @click="toggleModal({name:'settings'})">Cancel</div>
    <div slot="header">Settings</div>
    <div slot="right-icon">Save</div>
  </component>
</template>