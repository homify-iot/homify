import { iot, shadows } from "@/services/aws-iot";

const SET_DEVICES = "setDevices";
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
    console.log(name, status);
    state.devices.forEach(device => {
      if (device.thingName === name) {
        device.status = status;
      }
    });
  }
};
const actions = {
  fetchDevices: async ({ state, commit }, queryString: string) => {
    const { things } = await iot.searchIndex({ queryString }).promise();
    const getStatus = shadow => {
      const reported = JSON.parse(shadow).reported;
      return reported ? reported.status : false;
    };
    const devices = things.map(thing => {
      shadows.client.register(thing.thingName);
      return {
        thingGroupNames: thing.thingGroupNames,
        thingName: thing.thingName,
        thingId: thing.thingId,
        thingTypeName: thing.thingTypeName,
        status: thing.shadow && getStatus(thing.shadow),
        ...thing.attributes
      };
    });

    commit(SET_DEVICES, devices);
  },
  toggleDevice: ({ state, commit }, { name, status }) => {
    const stateObject = {
      state: {
        desired: {
          status
        }
      }
    };
    shadows.client.update(name, stateObject);
  }
};

export const devices = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
