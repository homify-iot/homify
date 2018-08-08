<template>
  <div class="home-layout">
    <el-menu :default-active="selectedRoom && selectedRoom.name" class="room-list">
      <el-menu-item 
        class="room-item"
        v-for="(room,index) in rooms" 
        :key="index"
        :index="room.name"
        @click="clickRoom">
        <svgicon 
          v-if="room.attributes.icon" 
          :icon="room.attributes.icon" 
          width="36" 
          height="36" 
          :original="true"/>
        <div>{{ room.name }}</div>
      </el-menu-item>
    </el-menu>
    <device-panel v-if="selectedRoom && selectedRoom.devices" :devices="selectedRoom.devices" :entities="entities"/>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { Devices } from "@/store/vuex-decorators";
import DevicePanel from "@/pages/home/components/devicePanel.vue";

@Component({
  components: {
    DevicePanel
  }
})
export default class Home extends Vue {
  @Devices.State rooms;

  @Devices.State devices;

  @Devices.State entities;

  get selectedRoom() {
    return typeof this.$route.params.roomName === "undefined"
      ? this.rooms[0]
      : this.rooms.find(room => room.name === this.$route.params.roomName);
  }

  clickRoom({ index }) {
    this.$router.push({ params: { roomName: index } });
  }
}
</script>

<style lang="scss" scoped>
.home-layout {
  display: flex;
}
.room-list {
  width: 100px;
  text-align: center;
  position: fixed;
  z-index: 10;
  .room-item {
    height: auto;
    line-height: inherit;
    padding: 1rem 0 !important;
  }
}
</style>


