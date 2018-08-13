import { Http } from "@/services/http.service";
const SET_ENTITIES = "setEntities";

const state = {
  entities: [],
};
const getters = {};
const mutations = {
  [SET_ENTITIES]: (state, entities) => {
    state.entities = entities;
  }
};
const actions = {
  fetchEntities: ({ commit }) => {
    Http.get("entities").then(res => commit(SET_ENTITIES, res.data));
  },
};

export const entities = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
