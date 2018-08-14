import { Http } from "@/services/http.service";
import { callService } from "@/mqtt";
const SET_ENTITIES = "setEntities";
const SET_STATE = "setState";

const state = {
  entities: [],
};
const getters = {};
const mutations = {
  [SET_ENTITIES]: (state, entities) => {
    state.entities = entities;
  },
  [SET_STATE]: (state, { entity_id, newState }) => {
    state.entities = state.entities.map(entity => {
      if (entity.entity_id === entity_id) {
        entity.state = newState;
      }
      return entity;
    })
  }
};
const actions = {
  fetchEntities: async ({ commit }) => {
    const { data: entities } = await Http.get("entities");
    commit(SET_ENTITIES, entities)
  },
  toggleDevice: ({ }, entity) => {
    // entity.state = !entity.state;
    const service = entity.state ? "turnOff" : "turnOn";
    callService(entity, service).subscribe()
  }
};

export const entities = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
