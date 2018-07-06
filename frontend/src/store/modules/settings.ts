const state = {
  sidebar: {
    opened: false,
    withoutAnimation: false
  },
  device: "desktop",
  language: "en"
};
const getters = {};
const mutations = {
  TOGGLE_SIDEBAR: state => {
    state.sidebar.opened = !state.sidebar.opened;
    state.sidebar.withoutAnimation = false;
  },
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    state.sidebar.opened = false;
    state.sidebar.withoutAnimation = withoutAnimation;
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device;
  },
  SET_LANGUAGE: (state, language) => {
    state.language = language;
  }
};
const actions = {
  toggleSideBar({ commit }) {
    commit("TOGGLE_SIDEBAR");
  },
  closeSideBar({ commit }, { withoutAnimation }) {
    commit("CLOSE_SIDEBAR", withoutAnimation);
  },
  toggleDevice({ commit }, device) {
    commit("TOGGLE_DEVICE", device);
  },
  setLanguage({ commit }, language) {
    commit("SET_LANGUAGE", language);
  }
};

export const settings = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
