import { iot } from "@/services/aws-iot";

const SET_ROOMS = "setRooms";
const SET_DEVICE_NAME = "setDeviceName";

const state = {
  rooms: []
};
const getters = {};
const mutations = {
  [SET_ROOMS]: (state, rooms) => {
    state.rooms = rooms;
  },
  [SET_DEVICE_NAME]: (state, devices) => {
    state.rooms.forEach((room, index) => {
      room.things = devices[index].things;
    });
  }
};
const actions = {
  fetchRooms: async ({ state, commit }) => {
    const { thingGroups } = await iot.listThingGroups().promise();
    const groups = await Promise.all(
      thingGroups.map(group =>
        iot.describeThingGroup({ thingGroupName: group.groupName }).promise()
      )
    );
    const rooms = groups.map(group => ({
      id: group.thingGroupId,
      name: group.thingGroupName,
      things: [],
      ...group.thingGroupProperties.attributePayload.attributes
    }));
    commit(SET_ROOMS, rooms);

    const roomWithDevices = await Promise.all(
      rooms.map(group =>
        iot.listThingsInThingGroup({ thingGroupName: group.name }).promise()
      )
    );
    commit(SET_DEVICE_NAME, roomWithDevices);
  },
  fetchDevice: async ({ state, commit }, thingName) => {
    const thing = await iot.describeThing({ thingName }).promise();
  }
};

export const rooms = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
