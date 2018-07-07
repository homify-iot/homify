<template>
  <div class="home-layout">
    <el-menu :default-active="selectedRoomName" class="room-list">
      <el-menu-item 
        class="room-item"
        v-for="(room,index) in rooms" 
        :key="index"
        :index="room.name"
        @click="clickRoom">
        <svgicon 
          v-if="room.icon" 
          :icon="room.icon" 
          width="36" 
          height="36" 
          :original="true"/>
        <div>{{ room.name }}</div>
      </el-menu-item>
    </el-menu>
    <el-row class="device-list">
      <el-col 
        :lg="6" 
        :sm="12" 
        class="device-item"
        v-for="(thingName,index) in roomDevices"
        :key="index">
        <device-switch :device="deviceInfo(thingName)" />
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { Rooms, Devices } from "@/store/vuex-decorators";
import DeviceSwitch from "@/components/DeviceSwitch/index.vue";
@Component({
  components: {
    DeviceSwitch
  }
})
export default class Home extends Vue {
  @Rooms.State("rooms") rooms;

  @Rooms.Action fetchRooms;

  @Devices.State("devices") devices;

  @Devices.Action fetchDevices;

  @Watch("$route.params")
  onRoomChange() {
    this.fetchDevices(this.selectedRoomName);
  }

  created() {
    if (this.rooms.length === 0) {
      this.fetchRooms().then(() => {
        this.fetchDevices(this.selectedRoomName);
      });
    }
  }

  get selectedRoomName() {
    return typeof this.$route.params.roomName === "undefined"
      ? this.rooms[0] && this.rooms[0].name
      : this.$route.params.roomName;
  }

  get roomDevices() {
    const selectedRoom = this.rooms.find(
      room => room.name === this.selectedRoomName
    );
    const devices = selectedRoom ? selectedRoom.things : [];
    return devices;
  }

  get deviceInfo() {
    return name => {
      return this.devices.find(device => device.thingName === name);
    };
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
.device-list {
  padding-left: 6.5rem;
  width: 100%;
  .device-item {
    padding: 0 10px;
  }
}
</style>


