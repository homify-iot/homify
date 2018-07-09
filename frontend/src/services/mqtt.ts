import mqtt from 'mqtt';
export const client = mqtt.connect('ws://localhost:9001', { clientId: "12312" })

client.on("error", function (error) {
  console.log(error);
});
client.on("message", function (_topic, message) {
  console.log(_topic, message.toString());
});