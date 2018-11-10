<template>
  <div class="home-layout">
    <div 
      class="column" 
      v-for="(column, index) in columnGroup" 
      :key="index" 
    >
      <el-card 
        class="group-card" 
        :body-style="{ padding: '0' }" 
        v-for="group in column" 
        :key="group"
      >
        <div slot="header" class="panel-row">
          <div class="card-title">
            {{ group }}
          </div>
          <el-button
            v-if="group === 'automation'"
            type="primary"
            icon="el-icon-plus"
            circle
            @click.native="toggleModal({name:'settings', type: 'automation', entityId: null})"
            size="mini"
          />
        </div>
        <div class="device-list">
          <div 
            class="device-item"
            v-for="entity in grouped[group]"
            :key="entity.entityId"
          >
            <device-switch 
              v-if="entity" 
              :entity="entity" 
              :state-info="statePool[entity.entityId]"
              :online="onlinePool[entity.entityId]"
            />
          </div>
        </div>
      </el-card>
    </div>
    <info-modal 
      v-if="info.visible"
      :state-pool="statePool" 
      :online-pool="onlinePool"
    />
    <automation-modal v-if="automation.visible" />
    <settings-modal v-if="settings.visible" />
    <condition-modal v-if="condition.visible" />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { Entities, Modal } from "@/store/vuex-decorators";
import DeviceSwitch from "@/components/DeviceSwitch/DeviceSwitch.vue";
import InfoModal from "@/components/Modal/InfoModal.vue";
import AutomationModal from "@/components/Modal/AutomationModal.vue";
import SettingsModal from "@/components/Modal/SettingsModal.vue";
import ConditionModal from "@/components/Modal/ConditionModal.vue";

@Component({
  components: {
    ConditionModal,
    DeviceSwitch,
    InfoModal,
    AutomationModal,
    SettingsModal
  }
})
export default class Home extends Vue {
  @Entities.Getter grouped;

  @Entities.Getter columnGroup;

  @Entities.State statePool;

  @Entities.State onlinePool;

  @Modal.State settings;

  @Modal.State info;

  @Modal.State condition;

  @Modal.State automation;

  @Modal.Mutation toggleModal;
}
</script>

<style lang="scss">
.home-layout {
  display: flex;
  flex-wrap: wrap;
  .column {
    flex: 1;
    padding: 0 4px;
    max-width: 500px;
  }
  .group-card {
    flex: 1;
    margin-bottom: 1rem;
    .el-card__header {
      border-bottom: none;
    }
    .panel-row {
      display: flex;
      justify-content: space-between;
      .card-title {
        text-transform: capitalize;
      }
    }
  }
  .device-list {
    width: 100%;
    .device-item {
      padding: 0 10px;
    }
  }
  .popup-body {
    position: relative;
    box-sizing: border-box;
    text-align: center;
    background-color: white;
  }
}

@media only screen and (max-width: 768px) {
  .home-layout {
    display: block;
  }
}
</style>


