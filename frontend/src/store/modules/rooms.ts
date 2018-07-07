import { Http } from "@/services/httpService";

const SET_ROOMS = "setRooms";

const state = {
  rooms: []
};
const getters = {};
const mutations = {
  [SET_ROOMS]: (state, rooms) => {
    state.rooms = rooms;
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
