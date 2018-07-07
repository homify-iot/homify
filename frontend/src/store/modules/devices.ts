const state = {
  devices: []
};
const getters = {
  getFrequentDevices: state => {
    return state.devices.slice(0, 3);
  }
};
const mutations = {
  setDevices: (state, devices) => {
    state.devices = devices;
  },
  setStatus: (state, { name, status }) => {
    state.devices.forEach(device => {
      if (device.thingName === name) {
        device.status = status;
      }
    });
  }
};
const actions = {
  fetchDevices: async () => { },
  toggleDevice: () => { }
};

export const devices = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
