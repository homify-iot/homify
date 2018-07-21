<template>
  <div>
    <el-row :gutter="20">
      <el-col 
        :md="8" 
        :sm="24"
        v-for="(room,index) in rooms" 
        :key="index">
        <router-link :to="{ name: 'home', params: { roomName: room.name }}">
          <el-card :body-style="{ padding: '0px' }" class="room-card">
            <div class="image-container">
              <img :src="room.attributes.image" class="room-image">
            </div>
            <div class="room-details">
              <svgicon 
                v-if="room.attributes.icon" 
                :icon="room.attributes.icon" 
                width="36" 
                height="36" 
                :original="true"/>
              <div class="room-name">{{ room.name }}</div>
              <div class="room-info">3 devices</div>
            </div>
          </el-card>
        </router-link>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Sidebar from "@/pages/layout/components/Sidebar/Sidebar.vue";
import Navbar from "@/pages/layout/components/Navbar.vue";
import Tabs from "@/pages/layout/components/Tabs.vue";
import AppMain from "@/pages/layout/components/AppMain.vue";
import DeviceSwitch from "@/components/DeviceSwitch/index.vue";

import { Rooms, Devices } from "@/store/vuex-decorators";
@Component({
  components: {
    Sidebar,
    Navbar,
    Tabs,
    AppMain,
    DeviceSwitch
  }
})
export default class Dashboard extends Vue {
  @Rooms.State("rooms") rooms;

  @Rooms.Action fetchRooms;

  @Devices.Action fetchDevices;

  created() {
    this.fetchRooms();
  }
}
</script>

<style lang="scss" scoped>
.room-card {
  border-radius: 0.375rem;
  margin-bottom: 2rem;
  cursor: pointer;
  .image-container {
    position: relative;
    width: 100%;
    padding-bottom: 50%;
    .room-image {
      width: 100%;
      height: 100%;
      position: absolute;
    }
  }
  .room-details {
    display: flex;
    padding: 1rem;
    align-items: center;
    .room-name {
      padding: 0 1.25rem;
      font-size: 1.25rem;
    }
    .room-info {
      margin-left: auto;
      color: #82858a;
    }
  }
}
.room-card:hover {
  box-shadow: 0 8px 12px 0 rgba(0, 0, 0, 0.4);
}
</style>

