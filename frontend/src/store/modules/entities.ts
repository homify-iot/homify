import { callService } from "@/mqtt";
import { Http } from "@/services/http.service";
import { transpose, splitEvery } from "ramda";

const SET_ENTITIES = "setEntities";
const SET_STATES = "setStates";
const SET_ONLINE = "setOnline";
const SET_LOGS = "setLogs";
const SET_STATE = "setState";

const state = {
  list: [],
  grouped: {},
  columnGroup: [],
  statePool: {},
  onlinePool: {},
  logs: []
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
    const groups = Object.keys(grouped);
    state.columnGroup = transpose(splitEvery(4, groups));
  },
  [SET_STATES]: (state, pool) => {
    state.statePool = pool;
  },
  [SET_ONLINE]: (state, pool) => {
    state.onlinePool = pool;
  },
  [SET_LOGS]: (state, logs) => {
    state.logs = logs;
  },
  [SET_STATE]: (state, { entityId, newState }) => {
    state.statePool[entityId] = newState;
  }
};

const actions = {
  fetchEntities: async ({ commit }) => {
    try {
      const { data: entities } = await Http.get("entities");
      const { data: statePool } = await Http.get("entities/states");
      const { data: onlinePool } = await Http.get("entities/online");
      commit(SET_ENTITIES, entities);
      commit(SET_STATES, statePool);
      commit(SET_ONLINE, onlinePool);
    } catch (e) {
      console.log(e);
    }
  },
  fetchLogs: async ({ commit }, entityId: string) => {
    try {
      const { data: logs } = await Http.get(`entities/logs/${entityId}`);
      commit(SET_LOGS, logs);
    } catch (e) {
      console.log(e);
    }
  },
  toggleDevice: ({ state }, entity) => {
    const service = state.statePool[entity.entityId]["state"] ? "turnOff" : "turnOn";
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
