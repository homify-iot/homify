import { callService } from "@/mqtt";
import { Http } from "@/services/http.service";
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
  [SET_STATE]: (state, { entityId, newState }) => {
    state.entities = state.entities.map(entity => {
      if (entity.entityId === entityId) {
        entity.state = newState;
        entity.stateLastUpdate = new Date();
      }
      return entity;
    });
  },
};

const actions = {
  fetchEntities: async ({ commit }) => {
    const { data: entities } = await Http.get("entities");
    commit(SET_ENTITIES, entities);
  },
  toggleDevice: ({ }, entity) => {
    const service = entity.state ? "turnOff" : "turnOn";
    callService(entity.entityId, service).subscribe();
  },
};

export const entities = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
