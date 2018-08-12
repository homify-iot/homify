import { Http } from "@/services/http.service";
import { updateDevice } from "@/mqtt";
const SET_ROOMS = "setRooms";
const SET_DEVICES = "setDeivces";
const SET_FLOORPLAN = "setFloorplan";
const SET_DEVICE_STATE = "setDeviceState";

const state = {
  rooms: [],
  devices: [],
  floorplan: []
};
const getters = {};
const mutations = {
  [SET_ROOMS]: (state, rooms) => {
    state.rooms = rooms;
  },
  [SET_DEVICES]: (state, devices) => {
    state.devices = devices;
  },
  [SET_FLOORPLAN]: (state, floorplan) => {
    state.floorplan = floorplan;
  },
  [SET_DEVICE_STATE]: (state, device) => {
    state.devices = state.devices.map(
      d => (d._id === device._id ? { ...d, ...device } : d)
    );
  }
};
const actions = {
  fetchRooms: ({ commit }) => {
    // Http.get("rooms").then(res => commit(SET_ROOMS, res.data));
  },
  fetchDevices: ({ commit }) => {
    // Http.get("devices").then(({ data }) => commit(SET_DEVICES, data));
  },
  fetchFloorplan: ({ commit }) => {
    Http.get("floorplan").then(res => commit(SET_FLOORPLAN, res.data));
  },
  updateDevice: (_, device) => {
    updateDevice(device);
  },
  updateDeviceState: ({ commit }, device) => {
    commit(SET_DEVICE_STATE, device);
  }
};

export const devices = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
