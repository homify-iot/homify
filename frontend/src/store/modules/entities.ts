import { callService } from "@/mqtt";
import { Http } from "@/services/http.service";
import transpose from "ramda/es/transpose";
import splitEvery from "ramda/es/splitEvery";

const SET_ENTITIES = "setEntities";
const SET_ENTITY = "setEntity";
const SET_STATES = "setStates";
const SET_ONLINE = "setOnline";
const SET_LOGS = "setLogs";
const SET_STATE = "setState";
const SET_LOADING = "setLoading";

const state = {
  list: [],
  statePool: {},
  onlinePool: {},
  logs: {},
  loadingLogs: true
};
const getters = {
  grouped: state => {
    return state.list.reduce((prev, next) => {
      if (next.group) {
        prev[next.group] = prev[next.group] || [];
        prev[next.group].push(next);
      } else {
        prev[next.type] = prev[next.type] || [];
        prev[next.type].push(next);
      }
      return prev;
    }, {});
  },
  columnGroup: (_state, getters) => {
    return transpose(splitEvery(4, Object.keys(getters.grouped)));
  }
};
const mutations = {
  [SET_ENTITIES]: (state, entities) => {
    state.list = entities;
  },
  [SET_ENTITY]: (state, entity) => {
    state.list = state.list.map(e => {
      if (e._id === entity._id) {
        return entity;
      }
      return e;
    });
  },
  [SET_STATES]: (state, pool) => {
    state.statePool = pool;
  },
  [SET_ONLINE]: (state, pool) => {
    state.onlinePool = pool;
  },
  [SET_LOGS]: (state, { entityId, logs }) => {
    state.logs[entityId] = logs;
    state.loadingLogs = false;
  },
  [SET_STATE]: (state, { entityId, newState }) => {
    state.statePool[entityId] = newState;
  },
  [SET_LOADING]: (state, loading) => {
    state.loadingLogs = loading;
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
      commit(SET_LOADING, true);
      const { data: logs } = await Http.get(`entities/logs/${entityId}`);
      commit(SET_LOGS, { entityId, logs });
      commit(SET_LOADING, false);
    } catch (e) {
      console.log(e);
    }
  },

  updateSettings: async ({ commit }, entity) => {
    try {
      const { data } = await Http.post(`entities/${entity._id}`, Object.freeze(entity));
      commit(SET_ENTITY, data);
    } catch (e) {
      console.log(e);
    }
  },

  toggleDevice: ({ state }, entity) => {
    const service = state.statePool[entity.entityId].state ? "turnOff" : "turnOn";
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
