import { Http } from "@/services/http.service";

const SET_ROOMS = "setRooms";

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
  }
};
const actions = {
  fetchRooms: ({ commit }) => {
    Http.get("rooms")
      .then(res => commit(SET_ROOMS, res.data))
  }
};

export const rooms = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
