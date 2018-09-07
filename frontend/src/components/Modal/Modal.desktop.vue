<script lang="ts">
import { Vue, Component, Prop, Emit } from "vue-property-decorator";

@Component
export default class ModalDesktop extends Vue {
  visible: boolean = false;

  @Prop() title: string;

  @Emit("visible-change")
  visibleChange() {}

  show() {
    this.visible = true;
    document.body.classList.add("modal-open");
    this.$emit("visible-change", this.visible);
  }

  hide() {
    this.visible = false;
    document.body.classList.remove("modal-open");
    this.$emit("visible-change", this.visible);
  }
}
</script>

<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
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