const miio = require("miio");
const devices = miio.devices({});

devices.on("available", device => {
  console.log(device);
  if (device.matches("placeholder")) {
    console.log(2222);
    // This device is either missing a token or could not be connected to
  } else {
    console.log(111);
    // Do something useful with device
  }
  console.log(232);
});

devices.on("unavailable", device => {
  console.log(device);
  // Device is no longer available and is destroyed
});

miio
  .device({ address: "192.168.1.9" })
  .then(handleDevice)
  .catch(console.error);

function handleDevice(device) {
  // console.log("Connected to", device);
  const children = device.children();
  console.log(children);
  for (const child of children) {
    if (child.matches("type:sensor")) {
      child.on("movement", () => console.log("Motion detected"));
    }
  }
  // device.togglePower().then(on => console.log("Power is now", on));
}
