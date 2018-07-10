import { Http } from "@/services/http.service";

const SET_ROOMS = "setRooms";
const SET_DEVICE_STATE = "setDeviceState";

const state = {
  rooms: [],
  devices: []
};
const getters = {};
const mutations = {
  [SET_ROOMS]: (state, rooms) => {
    state.rooms = rooms;
    state.devices = rooms.reduce((curr, next) => {
      return [...curr, ...next.devices || []]
    }, [])
  },
  [SET_DEVICE_STATE]: (state, device) => {
    state.devices = state.devices.map(_device => {
      _device._id === device._id;
      return { ..._device, ...device }
    })
  }
};
const actions = {
  fetchRooms: ({ commit }) => {
    Http.get("rooms")
      .then(res => commit(SET_ROOMS, res.data))
  },
  updateDeviceState: ({ commit }, device) => {
    commit(SET_DEVICE_STATE, device)
  }
};

export const rooms = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
