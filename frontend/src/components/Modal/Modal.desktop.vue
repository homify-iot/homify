<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class ModalDesktop extends Vue {
  @Prop() visible: boolean;

  @Prop() title: string;

  get v() {
    return this.visible;
  }

  set v(val) {
    this.$emit("visible-change", val);
  }
}
</script>

<template>
  <el-dialog
    :title="title"
    :visible.sync="v"
    width="30%"
  >
    <template slot="title">
      <slot name="header" />
    </template>

    <div class="modal-body">
      <slot />
    </div>

    <div class="modal-footer">
      <slot name="footer" />
    </div>
  </el-dialog>
</template>

<style lang="scss">
</style>