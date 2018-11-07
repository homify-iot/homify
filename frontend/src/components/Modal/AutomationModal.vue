<script lang="ts">
  import {Component, Vue} from "vue-property-decorator";
  import ModalMobile from "@/components/Modal/Modal.mobile.vue";
  import ModalDesktop from "@/components/Modal/Modal.desktop.vue";
  import {Entities, Modal, Settings} from "@/store/vuex-decorators";

  @Component({
  components: {
    ModalMobile,
    ModalDesktop
  }
})
export default class AutomationModal extends Vue {
  @Settings.Getter isMobile;

  @Modal.State automation;

  @Modal.Getter entity;

  @Modal.Mutation toggleModal;

  @Entities.Action updateSettings;

  @Entities.Getter entityById;

  updatedEntities = {};

  update(obj) {
    this.updatedEntities = Object.assign({}, this.updatedEntities, obj);
  }

  get changed() {
    return Boolean(Object.keys(this.updatedEntities).length);
  }

  get triggerText() {
    return this.entity.status ? "打开" : "关闭";
  }

  get textClass() {
    return this.entity.status ? "on" : "off";
  }
}
</script>

<template>
  <component class="auto-modal" :is="isMobile ? 'modal-mobile' : 'modal-desktop'" :visible="automation.visible">
    <svgicon slot="left-icon" icon='left' @click="toggleModal({name:'automation'})" />
    <div slot="header">{{ entity.name }}</div>
    <svgicon slot="right-icon" icon='settings' @click="toggleModal({name:'settings'})" />
    <el-card :body-style="{ padding: '0px' }">
      <div slot="header" class="panel-row">
        <div class="label">If</div>
        <el-button 
          type="primary"
          icon="el-icon-plus"
          circle
          @click.native="toggleModal({name:'condition', type:'if'})"
          size="mini"
        />
      </div>
      <div class="automation-row" v-for="trigger in entity.triggers" :key="trigger.entityId">
        <div class="device-block">
          <div class="icon">
            <img v-if="entityById(trigger.entityId).image" :src=" entityById(trigger.entityId).image" style="width: 100%">
            <svgicon
              v-else
              :icon="entityById(trigger.entityId).icon"
              width="26"
              height="26"
            />
          </div>
          <div>{{ entityById(trigger.entityId).name }}</div>
        </div>
        <div :class="[textClass]">
          {{ triggerText }}
        </div>
      </div>
    </el-card>
    <el-card :body-style="{ padding: '0px' }" class="action-panel">
      <div slot="header" class="panel-row">
        <div class="label">Then</div>
        <el-button
          type="primary"
          icon="el-icon-plus"
          circle
          size="mini"
        />
      </div>
      <div class="automation-row" v-for="action in entity.actions" :key="action.entityId">
        <div :class="[textClass]">
          {{ triggerText }}
        </div>
        <div class="device-block">
          <div class="icon">
            <img v-if=" entityById(action.entityId).image" :src=" entityById(action.entityId).image" style="width: 100%">
            <svgicon
              v-else
              :icon="entityById(action.entityId).icon"
              width="26"
              height="26"
            />
          </div>
          <div>{{ entityById(action.entityId).name }}</div>
        </div>
      </div>
    </el-card>
  </component>
</template>

<style lang="scss">
  @import "@/styles/themes/default.scss";
  .auto-modal {
    .el-card__header {
      padding: 10px;
      .panel-row {
        display: flex;
        justify-content: space-between;
        .label {
          align-self: center;
        }
      }
    }
    .automation-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: .8rem;
      .device-block {
        display: flex;
        align-items: center;
        .icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 3rem;
          font-size: 3.75rem;
          border-radius: 0.375rem;
          transition: width 0.4s ease;
        }
      }
      .on {
        color: $color-success
      }
    }
    .action-panel {
      margin-top: 1rem;
    }
  }
</style>
