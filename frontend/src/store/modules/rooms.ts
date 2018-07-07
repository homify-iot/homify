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
  fetchRooms: async ({ state, commit }) => {},
  fetchDevice: async ({ state, commit }, thingName) => {}
};

export const rooms = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
