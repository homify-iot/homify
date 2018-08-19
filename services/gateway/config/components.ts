export default {
  discovery:
    [
      {
        name: "xiaomi",
        gateways: [],
        cacheTIme: 300,
      },
    ],
  automation: [
    {
      triggers: [
        {
          entityId: "miio:158d0001dc2f99",
          type: "state",
          from: false,
          to: true,
        },
      ],
      actions: [
        {
          entityId: "miio:158d00025255eb:0",
          service: "turnOn",
        },
      ],
    },
  ],
  entities: [
    { entityId: "miio:62821767", name: "PowerStrip", type: "switch", platform: "xiaomi", group: "Study Room" },
    {
      entityId: "miio:158d000249481b:0", name: "Wall Switch Left", icon: "device/lightbulb",
      type: "switch", platform: "xiaomi", group: "Living Room"
    },
    {
      entityId: "miio:158d000249481b:1", name: "Wall Switch Right", icon: "device/lightbulb",
      type: "switch", platform: "xiaomi", group: "Living Room"
    },
    {
      entityId: "miio:158d00025255eb:0", name: "Wall Switch Light", icon: "device/lightbulb", type:
        "switch", platform: "xiaomi", group: "Study Room"
    },
    {
      entityId: "miio:158d0002494831:0", name: "Wall Switch Left", icon: "device/lightbulb",
      type: "switch", platform: "xiaomi", group: "Master Room"
    },
    {
      entityId: "miio:158d0002494831:1", name: "Wall Switch Right", icon: "device/lightbulb",
      type: "switch", platform: "xiaomi", group: "Master Room"
    },
    {
      entityId: "miio:158d0001dc2f99", name: "Motion sensor", icon: "device/motion", platform: "xiaomi",
      group: "Study Room"
    }]
};
