import { Http } from "@/services/http.service";
import { mqtt } from "@/main";

const SET_ROOMS = "setRooms";
const SET_DEVICE_STATE = "setDeviceState";

const state = {
  rooms: [],
};
const getters = {
  devices: (state) => {
    return state.rooms.reduce((pre, cur) => pre.concat(...cur.devices), []);
  },
  floorplanDevices: (_, getters) => {
    return getters.devices.filter(d => d.floorplan);
  }
};
const mutations = {
  [SET_ROOMS]: (state, rooms) => {
    state.rooms = rooms;
  },
  [SET_DEVICE_STATE]: (state, device) => {
    state.rooms = state.rooms.map(room => {
      const devices = room.devices.map(_device => {
        if (_device._id === device._id) {
          return { ..._device, ...device };
        }
        return _device
      })
      return { ...room, devices };
    })
  }
};
const actions = {
  fetchRooms: ({ commit }) => {
    Http.get("rooms")
      .then(res => commit(SET_ROOMS, res.data))
  },
  updateDevice: (_, device) => {
    mqtt.update(device);
  },
  updateDeviceState: ({ commit }, device) => {
    commit(SET_DEVICE_STATE, device)
  }
};

export const devices = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
