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
    { entityId: "miio:62821767", name: "PowerStrip", type: "switch", platform: "xiaomi" },
    {
      entityId: "miio:158d000249481b:0", name: "Living Room Light Left", icon: "device/lightbulb",
      type: "switch", platform: "xiaomi",
    },
    {
      entityId: "miio:158d000249481b:1", name: "Living Room Light Right", icon: "device/lightbulb",
      type: "switch", platform: "xiaomi",
    },
    {
      entityId: "miio:158d00025255eb:0", name: "Study Room Light", icon: "device/lightbulb", type:
        "switch", platform: "xiaomi",
    },
    {
      entityId: "miio:158d0002494831:0", name: "Master Room Light Left", icon: "device/lightbulb",
      type: "switch", platform: "xiaomi",
    },
    {
      entityId: "miio:158d0002494831:1", name: "Master Room Light Right", icon: "device/lightbulb",
      type: "switch", platform: "xiaomi",
    },
    { entityId: "miio:158d0001dc2f99", name: "Study Room Motion sensor", icon: "device/motion", platform: "xiaomi" }],
};
