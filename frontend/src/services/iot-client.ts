import AWS from "aws-sdk";
import AwsIot from "aws-iot-device-sdk";
import Amplify, { API, Auth } from "aws-amplify";
import { AWSIoTProvider } from "aws-amplify/lib/PubSub";
import { config } from "@/aws-exports";
let instance = null;
export default class IotClient {
  client: any;
  constructor(createNewClient = false, options = {}) {
    if (createNewClient && instance) {
      instance.disconnect();
      instance = null;
    }

    if (instance) {
      return instance;
    }
    instance = this;
    this.initClient(options);
    this.attachDebugHandlers();
  }
  initClient(options) {
    const clientId = `iot-${Math.floor(Math.random() * 1000000 + 1)}`;
    this.client = AwsIot.thingShadow({
      region: config.region,
      host: config.host,
      clientId,
      protocol: "wss",
      maximumReconnectTimeMs: 20000,
      accessKeyId: "",
      secretKey: "",
      sessionToken: ""
    });
  }
  disconnect() {
    this.client.end();
  }
  attachDebugHandlers() {
    this.client.on("reconnect", () => {
      console.log("reconnect");
    });

    this.client.on("offline", () => {
      console.log("offline");
    });

    this.client.on("error", err => {
      console.log("iot client error", err);
    });

    this.client.on("message", (topic, message) => {
      console.log("new message", topic, JSON.parse(message.toString()));
    });
  }
  updateWebSocketCredentials() {
    AWS.config.region = config.region;
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: config.IdentityPoolId
    });
    AWS.config.credentials["get"](error => {
      if (error) {
        console.log(error);
      }
      const {
        accessKeyId,
        secretAccessKey,
        sessionToken
      } = AWS.config.credentials;
      const credentialSubset = { accessKeyId, secretAccessKey, sessionToken };
      this.client.updateWebSocketCredentials(
        accessKeyId,
        secretAccessKey,
        sessionToken
      );
    });
  }
}
