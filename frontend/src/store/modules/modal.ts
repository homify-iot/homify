const state = {
  entityId: undefined,
  info: {
    visible: false
  },
  automation: {
    visible: false
  },
  settings: {
    visible: false
  }
};
const getters = {
  entity: (state, _getters, rootState) => {
    return rootState.entities.list.find(e => e.entityId === state.entityId) || {};
  }
};
const mutations = {
  toggleModal: (state, { name, visible, entityId }) => {
    state[name] = {
      visible: visible === undefined ? !state[name].visible : visible,
    };
    if (entityId !== undefined) { state.entityId = entityId; }
  }
};
const actions = {
};

export const modal = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
