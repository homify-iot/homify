import { createDebug } from "services/debug.service";
import config from "./config/config";
import app from "./config/express";

const log = createDebug("Server");

app.listen(config.port, async () => {
  log(`server started on port ${config.port} (${config.env})`);
});
export default app;
