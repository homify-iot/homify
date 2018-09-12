<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class ModalMobile extends Vue {
  @Prop() visible: boolean;

  @Prop() headerClass: string;

  @Prop() bodyClass: string;
}
</script>

<template>
  <transition name="slide">
    <div v-if="visible" class="modal">
      <div class="modal-container">
        <div :class="['modal-header', headerClass]">
          <slot name="left-icon" />
          <slot name="header" />
          <slot name="right-icon" />
        </div>

        <div :class="['modal-body', bodyClass]">
          <slot />
        </div>

        <div class="modal-footer">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </transition>
</template>

<style lang="scss">
.modal {
  position: fixed;
  top: 0;
  left: 0;
  color: #555;
  z-index: 8888;
  .modal-container {
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: #fff;
    .modal-header {
      display: flex;
      padding: 0 20px;
      height: 50px;
      border-bottom: 1px solid rgb(219, 219, 219);
      justify-content: space-between;
      align-items: center;
    }
    .modal-footer {
      display: flex;
      padding: 0 20px;
      border-top: 1px solid rgb(219, 219, 219);
    }
    .modal-body {
      flex: 1;
      padding: 20px;
      overflow-y: auto;
    }
  }
}

.slide-leave-active,
.slide-enter-active {
  transition: 0.4s;
}
.slide-enter,
.slide-leave-to {
  transform: translate(100%, 0);
}
</style>