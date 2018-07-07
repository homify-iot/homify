<template>
  <el-card v-if="device" :body-style="{ padding: '0' }" class="card">
    <div class="device-content" :class="{'off': !device.status}">
      <div class="icon" :class="device.type.color" @click="switchDevice(device)">
        <svgicon 
          class=""
          :icon="device.type.icon" 
          width="50" 
          height="50"/>
      </div>
      <div class="details">
        <div class="title">{{ device.name }}</div>
        <div class="status">{{ device.status ? 'on': 'off' }}</div>
      </div>
    </div>
  </el-card>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { Devices } from "@/store/vuex-decorators";

@Component
export default class DeviceSwitch extends Vue {
  @Prop() device;

  @Devices.Action toggleDevice;

  switchDevice(device) {
    this.toggleDevice({ name: device.thingName, status: !device.status });
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
    &:hover {
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
    flex-direction: column;
    justify-content: center;
    .title {
      font-family: $font-secondary;
      font-size: 1.25rem;
      font-weight: $font-weight-bold;
      color: $card-fg-heading;
    }
    .status {
      font-size: 1rem;
      font-weight: $font-weight-light;
      text-transform: uppercase;
      color: $card-fg;
    }
  }
}
</style>
