<template>
  <el-card :body-style="{ padding: '0' }" class="card">
    <div class="device-content" :class="{'off': !isOn}">
      <div class="icon" :class="[colorClass,clickClass]" @click="isSwitchable && toggleDevice(entity)">
        <img v-if="entity.image" :src="entity.image" style="width: 100%">
        <svgicon 
          v-else
          :icon="entity.icon" 
          width="50" 
          height="50"/>
      </div>
      <div class="details">
        <div class="title">{{ entity.name }}</div>
        <div class="state-info">
          <div class="status">{{ isOn ? 'on': 'off' }}</div>
          <timeago v-if="entity.stateLastUpdate" :datetime="entity.stateLastUpdate" :auto-update="60" />
        </div>
      </div>
      <div class="status-bar">
        <svgicon 
          class="available-icon"
          :icon="entity.available ?'wifi':'offline'" />
        <el-switch 
          v-if="isSwitchable" 
          :active-value="!isOn" 
          @click.native="isSwitchable && toggleDevice(entity)"/>
      </div>
    </div>
  </el-card>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { Entities } from "@/store/vuex-decorators";

@Component
export default class DeviceSwitch extends Vue {
  @Prop({ default: () => ({}) })
  entity;

  @Entities.Action toggleDevice;

  get isOn() {
    return this.entity.state;
  }

  get isSwitchable() {
    return this.entity.type === "switch";
  }

  get colorClass() {
    return this.isSwitchable ? "warning" : "primary";
  }

  get clickClass() {
    return this.isSwitchable ? "clickable" : "";
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
    height: 100%;
    margin: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 5.75rem;
    height: 4.75rem;
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
    &.clickable:hover {
      cursor: pointer;
      &.primary {
        background-image: btn-hero-primary-light-gradient();
      }
      &.success {
        background-image: btn-hero-success-light-gradient();
      }
      &.info {
        background-image: btn-hero-info-light-gradient();
      }
      &.warning {
        background-image: btn-hero-warning-light-gradient();
      }
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
    padding: 0 0.5rem;
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: center;
    .title {
      font-family: $font-secondary;
      font-size: 1.25rem;
      font-weight: $font-weight-bold;
      color: $card-fg-heading;
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
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 0.5rem;
    .available-icon {
      align-self: flex-end;
    }
  }
}
</style>
