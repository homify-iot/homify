import { menuRoutes } from "@/router";

const SET_ROUTES = "setRoutes";

const state = {
  routes: [],
};
const getters = {};
const mutations = {
  [SET_ROUTES]: (state, payload) => {
    state.routes = payload;
  },
};
const actions = {
  fetchRoutes: async ({ commit }) => {
    commit(SET_ROUTES, menuRoutes);
  },
};

export const permission = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
