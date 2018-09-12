const state = {
  entity: {
    name: "",
    entityId: "",
    type: ""
  },
  info: {
    visible: false,
  },
  settings: {
    visible: false
  }
};
const getters = {
};
const mutations = {
  toggleModal: (state, { name, visible, props }) => {
    state[name] = {
      visible: visible === undefined ? !state[name].visible : visible,
    };
    if (props) { state.entity = props; }
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
