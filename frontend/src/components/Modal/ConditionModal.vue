<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import ModalMobile from "@/components/Modal/Modal.mobile.vue";
import ModalDesktop from "@/components/Modal/Modal.desktop.vue";
import { Settings, Modal, Entities } from "@/store/vuex-decorators";
import cond from "ramda/es/cond";
import always from "ramda/es/always";
import equals from "ramda/es/equals";
import T from "ramda/es/T";

@Component({
  components: {
    ModalMobile,
    ModalDesktop
  }
})
export default class ConditionModal extends Vue {
  @Settings.Getter isMobile;

  @Modal.State condition;

  @Modal.Getter entity;

  @Modal.Mutation toggleModal;

  @Entities.State list;

  @Entities.Action addCondition;

  get colorClass() {
    return cond([
      [equals("switch"), always("warning")],
      [equals("sensor"), always("success")],
      [equals("binarySensor"), always("primary")],
      [T, always("info")]
    ]);
  }

  isThenable(entity) {
    return this.condition.type === "then" ? entity.type === "switch" : entity.type !== "automation";
  }

  selectCondition(entityId, state) {
    const condition = this.condition.type === "if" ?
      {
        entityId,
        type: "state",
        to: state
      } : {
        entityId,
        service: state ? "turnOn" : "turnOff"
      };
    this.addCondition({
      id: this.entity.entityId,
      type: this.condition.type,
      condition
    }).then(() => {
      this.toggleModal({ name: "condition" });
    });
  }
}
</script>

<template>
  <component 
    class="condition-model" 
    :is="isMobile ? 'modal-mobile' : 'modal-desktop'" 
    :visible="condition.visible" 
    @visible-change="(visible) => toggleModal({name:'condition',visible})"
  >
    <svgicon slot="left-icon" icon='left' @click="toggleModal({name:'condition'})" />
    <div slot="header">Select conditions --- {{ condition.type }}</div>
    <div slot="right-icon" />
    <el-collapse>
      <el-collapse-item v-for="entity in list" v-if="isThenable(entity)" :key="entity.entityId">
        <template slot="title">
          <div class="device-content">
            <div class="icon" :class="[!entity.image && colorClass(entity.type)]">
              <img v-if="entity.image" :src="entity.image" style="width: 100%">
              <svgicon
                v-else
                :icon="entity.icon"
                width="26"
                height="26"
              />
            </div>
            <div class="title">
              {{ entity.name }}
            </div>
            <div class="group">
              {{ entity.group }}
            </div>
          </div>
        </template>
        <el-button type="success" size="small" @click="selectCondition(entity.entityId, true)">ON</el-button>
        <el-button type="danger" size="small" @click="selectCondition(entity.entityId, false)">OFF</el-button>
      </el-collapse-item>
    </el-collapse>
  </component>
</template>

<style lang="scss">
.condition-model {
  .title {
    padding: 0 .5rem;
  }
  .group {
    font-weight: 200;
  }
}
</style>
