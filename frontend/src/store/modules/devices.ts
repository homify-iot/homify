import { Http } from "@/services/http.service";
import { updateDevice } from "@/mqtt";
import {
  pluck,
  isEmpty,
  compose,
  innerJoin,
  unnest,
  indexBy,
  prop,
  merge
} from "ramda";
const SET_ROOMS = "setRooms";
const SET_DEVICES = "setDeivces";
const SET_FLOORPLAN = "setFloorplan";
const SET_DEVICE_STATE = "setDeviceState";

const state = {
  rooms: [],
  devices: [],
  entities: {},
  floorplan: []
};
const getters = {
  entities: state => {
    return device_ids => {
      if (isEmpty(state.devices) || isEmpty(device_ids)) return [];
      const d = innerJoin((d, id) => d._id === id, state.devices, device_ids);
      return unnest(pluck("entities")(d));
    };
  }
};
const mutations = {
  [SET_ROOMS]: (state, rooms) => {
    state.rooms = rooms;
  },
  [SET_DEVICES]: (state, devices) => {
    state.devices = devices;
    const e = compose(
      unnest,
      pluck("entities")
    )(devices);
    state.entities = merge(
      indexBy(prop("_id"), e),
      indexBy(prop("_id"), devices)
    );
  },
  [SET_FLOORPLAN]: (state, floorplan) => {
    state.floorplan = floorplan;
  },
  [SET_DEVICE_STATE]: (state, device) => {
    if (state.entities[device._id]) {
      state.entities[device._id].state = merge(
        state.entities[device._id].state,
        device.state
      );
    }
  }
};
const actions = {
  fetchRooms: ({ commit }) => {
    Http.get("rooms").then(res => commit(SET_ROOMS, res.data));
  },
  fetchDevices: ({ commit }) => {
    Http.get("devices").then(({ data }) => commit(SET_DEVICES, data));
  },
  fetchFloorplan: ({ commit }) => {
    Http.get("floorplan").then(res => commit(SET_FLOORPLAN, res.data));
  },
  updateDevice: (_, device) => {
    updateDevice(device);
  },
  updateDeviceState: ({ commit }, device) => {
    commit(SET_DEVICE_STATE, device);
  }
};

export const devices = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
