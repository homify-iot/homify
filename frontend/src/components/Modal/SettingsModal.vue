<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import ModalMobile from "@/components/Modal/Modal.mobile.vue";
import ModalDesktop from "@/components/Modal/Modal.desktop.vue";
import { Settings, Modal, Entities } from "@/store/vuex-decorators";

@Component({
  components: {
    ModalMobile,
    ModalDesktop
  }
})
export default class SettingsModal extends Vue {
  @Settings.Getter isMobile;

  @Modal.State entityId;

  @Modal.State settings;

  @Modal.Getter entity;

  @Modal.Mutation toggleModal;

  @Entities.Action updateSettings;

  @Entities.Action addAutomation;

  updatedEntities = { name: "" };

  save() {
    if (this.entityId) {
      this.updateSettings({ _id: this.entity._id, type: this.entity.type, ...this.updatedEntities }).then(() => {
        this.toggleModal({ name: "settings" });
      });
    } else if (this.settings.type === "automation") {
      this.addAutomation(this.updatedEntities.name).then(() => {
        this.toggleModal({ name: "settings" });
      });
    }
  }

  update(obj) {
    this.updatedEntities = Object.assign({}, this.updatedEntities, obj);
  }

  get changed() {
    return Boolean(Object.keys(this.updatedEntities).length);
  }
}
</script>

<template>
  <component class="settings-modal" :is="isMobile ? 'modal-mobile' : 'modal-desktop'" :visible="settings.visible">
    <div slot="left-icon" icon='left' @click="toggleModal({name:'settings'})">Cancel</div>
    <div slot="header">Settings</div>
    <div slot="right-icon" @click="save()"><el-button type="text" class="button-save" :disabled="!changed">Save</el-button></div>
    <div class="input-fields">
      <el-input 
        v-if="settings.type !== 'automation'"
        placeholder="Please input" 
        :value="entity.group" 
        @input="group => update({group})"
      >
        <template slot="prepend">Group</template>
      </el-input>
      <el-input placeholder="Please input" :value="entity.name" @input="name => update({name})">
        <template slot="prepend">Name</template>
      </el-input>
      <el-input 
        v-if="settings.type !== 'automation'" 
        placeholder="Please input" 
        :disabled="true" 
        :value="entity.type"
      >
        <template slot="prepend">Type</template>
      </el-input>
    </div>
  </component>
</template>

<style lang="scss">
.settings-modal {
  .button-save {
    color: #66bb6a;
  }
  .input-fields {
    .el-input {
      padding: 5px 0;
      .el-input-group__prepend {
        min-width: 80px;
      }
    }
  }
}
</style>
