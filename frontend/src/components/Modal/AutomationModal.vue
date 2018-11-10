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

  @Entities.Action removeCondition;

  @Entities.Getter entityById;

  updatedEntities = {};

  update(obj) {
    this.updatedEntities = Object.assign({}, this.updatedEntities, obj);
  }

  get changed() {
    return Boolean(Object.keys(this.updatedEntities).length);
  }

  remove(type, entityId) {
    this.removeCondition({
      id: this.entity.entityId,
      type,
      entityId
    });
  }
}
</script>

<template>
  <component 
    class="auto-modal" 
    :is="isMobile ? 'modal-mobile' : 'modal-desktop'" 
    :visible="automation.visible" 
    @visible-change="(visible) => toggleModal({name:'automation',visible})"
  >
    <svgicon slot="left-icon" icon='left' @click="toggleModal({name:'automation'})" />
    <div slot="header">{{ entity.name }}</div>
    <svgicon slot="right-icon" icon='settings' @click="toggleModal({name:'settings', type:'automation'})" />
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
        <div>
          {{ trigger.to ? "打开" : "关闭" }}
          <el-button
            type="danger"
            icon="el-icon-minus"
            circle
            @click.native="remove('if', trigger.entityId)"
            size="mini"
          />
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
          @click.native="toggleModal({name:'condition', type:'then'})"
          size="mini"
        />
      </div>
      <div class="automation-row" v-for="action in entity.actions" :key="action.entityId">
        <div>
          {{ action.service }}
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
          <el-button
            type="danger"
            icon="el-icon-minus"
            circle
            @click.native="remove('then', action.entityId)"
            size="mini"
          />
        </div>
      </div>
    </el-card>
  </component>
</template>

<style lang="scss">
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
    }
    .action-panel {
      margin-top: 1rem;
    }
  }
</style>
