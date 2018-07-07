import axios from "axios";

const SET_ROOMS = "setRooms";
const SET_DEVICE_NAME = "setDeviceName";

const state = {
  rooms: []
};
const getters = {};
const mutations = {
  [SET_ROOMS]: (state, rooms) => {
    state.rooms = rooms;
  },
  [SET_DEVICE_NAME]: (state, devices) => {
    state.rooms.forEach((room, index) => {
      room.things = devices[index].things;
    });
  }
};
const actions = {
  fetchRooms: async () => {
    axios.get("/api/gateway/test")
      .then(res => {
        console.log(res);
      })
  },
  fetchDevice: async () => { }
};

export const rooms = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
