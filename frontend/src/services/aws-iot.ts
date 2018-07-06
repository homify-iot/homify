import AWS from "aws-sdk";
import IotClient from "@/services/iot-client";
export const shadows = new IotClient();
shadows.updateWebSocketCredentials();
export const iot = new AWS.Iot();
import store from "@/store";

shadows.client.on("status", (name, statusType, clientToken, stateObject) => {
  console.log(name, statusType, clientToken, stateObject);
  if (stateObject.state && stateObject.state.reported) {
    statusHandler(name, stateObject.state.reported.status);
  }
});
shadows.client.on("delta", (name, status) => {
  console.log(name, status);
  // statusHandler(name, stateObject.state.reported.status);
});
shadows.client.on("error", function(error) {
  console.log("error", error);
});

shadows.client.on("message", function(topic, payload) {
  console.log("message", topic, payload.toString());
});
shadows.client.on("foreignStateChange", (name, statusType, stateObject) => {
  console.log(name, statusType, stateObject);
  stateObject.state &&
    stateObject.state.reported &&
    statusHandler(name, stateObject.state.reported.status);
});
function statusHandler(name, status) {
  store.commit("devices/setStatus", { name, status }, { root: true });
}
// iot.updateIndexingConfiguration(
//   {
//     thingIndexingConfiguration: {
//       thingIndexingMode: "REGISTRY_AND_SHADOW"
//     }
//   },
//   function(err, data) {
//     if (err) console.log(err, err.stack);
//     // an error occurred
//     else console.log(data); // successful response
//   }
// );
