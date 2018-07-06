const state = {
  visitedTabs: [],
  cachedTabs: []
};
const getters = {};
const mutations = {
  ADD_TABS: (state, view) => {
    const tmp = [...state.visitedTabs];
    const dupName = tmp.findIndex(v => v.name === view.name);
    if (dupName > -1) {
      tmp[dupName].path = view.path;
    } else {
      tmp.push({
        name: view.name,
        path: view.path,
        params: view.params,
        title: view.meta.title || "no-name"
      });
    }
    state.visitedTabs = tmp;
    if (!view.meta.noCache) {
      state.cachedTabs.push(view.name);
    }
  },
  DEL_TAB: (state, path) => {
    state.visitedTabs = state.visitedTabs.filter(
      tab => tab && tab.path !== path
    );
    state.cachedTabs = state.cachedTabs.filter(tab => tab && tab.path !== path);
  }
};
const actions = {
  addTabs({ commit, state }, view) {
    if (!view.name || state.visitedTabs.some(v => v.path === view.path)) return;
    commit("ADD_TABS", view);
  },
  delTab({ commit, state }, path) {
    commit("DEL_TAB", path);
  }
};

export const tabs = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
