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
};
