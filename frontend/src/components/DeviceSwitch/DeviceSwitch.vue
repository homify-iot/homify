<template>
  <el-card :body-style="{ padding: '0' }" class="card" shadow="hover">
    <div class="device-content" :class="{'off': !isOn}">
      <div class="icon" :class="[colorClass(entity.type)]" @click="showInfo">
        <img v-if="entity.image" :src="entity.image" style="width: 100%">
        <svgicon 
          v-else
          :icon="entity.icon" 
          width="26" 
          height="26"/>
      </div>
      <div class="details" @click="showInfo">
        <div class="title">
          {{ entity.name }}
          <svgicon 
            class="available-icon"
            :icon="online ?'wifi':'offline'" />
        </div>
        
        <div class="state-info">
          <timeago v-if="stateInfo.last_update" :datetime="stateInfo.last_update" :auto-update="60" />
        </div>
      </div>
      <div class="status-bar">
        <el-switch 
          v-if="isSwitchable" 
          :active-value="!isOn" 
          @click.native="isSwitchable && toggleDevice(entity)"/>
        <div v-else>
          <strong>{{ stateInfo.state.value }}</strong> <span v-html="stateInfo.state.unit"/>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from "vue-property-decorator";
import { Entities } from "@/store/vuex-decorators";
import { cond, always, equals, T } from "ramda";

@Component
export default class DeviceSwitch extends Vue {
  @Prop({ default: () => ({}) })
  entity;

  @Prop({ default: () => ({ state: "" }) })
  stateInfo;

  @Prop() online;

  @Emit("show-info")
  showInfo() {}

  @Entities.Action toggleDevice;

  get isOn() {
    return this.stateInfo.state;
  }

  get isSwitchable() {
    return this.entity.type === "switch";
  }

  get colorClass() {
    return cond([
      [equals("switch"), always("warning")],
      [equals("sensor"), always("success")],
      [equals("binarySensor"), always("primary")],
      [T, always("info")]
    ]);
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/themes/default.scss";
@import "@/styles/mixins/button.scss";
.card {
  margin-bottom: 20px;
}
.device-content {
  display: flex;
  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 3rem;
    font-size: 3.75rem;
    border-radius: 0.375rem;
    transition: width 0.4s ease;
    color: #fff;
    &.primary {
      @include btn-hero-primary-gradient();
      @include btn-hero-primary-bevel-glow-shadow();
    }
    &.success {
      @include btn-hero-success-gradient();
      @include btn-hero-success-bevel-glow-shadow();
    }
    &.info {
      @include btn-hero-info-gradient();
      @include btn-hero-info-bevel-glow-shadow();
    }
    &.warning {
      @include btn-hero-warning-gradient();
      @include btn-hero-warning-bevel-glow-shadow();
    }
  }

  &.off {
    color: $card-fg;

    .icon {
      color: $card-fg;

      &.primary,
      &.success,
      &.info,
      &.warning {
        box-shadow: none;
        background-image: linear-gradient(to right, transparent, transparent);
      }
    }
    .details {
      .title {
        color: $card-fg;
      }
    }
  }
  .details {
    padding: 0 1rem;
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: center;
    min-height: 3rem;
    cursor: pointer;
    .title {
      font-family: $font-secondary;
      font-size: 1rem;
      font-weight: $font-weight-bold;
      color: $card-fg-heading;
      text-transform: capitalize;
    }
    .state-info {
      display: flex;
      justify-content: space-between;
      color: $card-fg;
      .status {
        font-size: 1rem;
        font-weight: $font-weight-light;
        text-transform: uppercase;
        padding-right: 1rem;
      }
    }
  }
  .status-bar {
    padding: 0.5rem;
    align-self: center;
  }
}
</style>
