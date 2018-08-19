import { callService } from "@/mqtt";
import { Http } from "@/services/http.service";

const SET_ENTITIES = "setEntities";
const SET_STATE = "setState";

const state = {
  list: [],
  grouped: {}
};
const getters = {};
const mutations = {
  [SET_ENTITIES]: (state, entities) => {
    state.list = entities;
    const grouped = entities.reduce((prev, next) => {
      if (next.group) {
        prev[next.group] = prev[next.group] || [];
        prev[next.group].push(next);
      } else {
        prev[next.type] = prev[next.type] || []
        prev[next.type].push(next);
      }
      return prev;
    }, {})
    state.grouped = grouped;
  },
  [SET_STATE]: (state, { entityId, newState }) => {
    Object.keys(state.grouped).forEach(group => {
      state.grouped[group] = state.grouped[group].map(entity => {
        if (entity.entityId === entityId) {
          entity.state = newState;
          entity.stateLastUpdate = new Date();
        }
        return entity;
      });
    })
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
