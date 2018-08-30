import mongoose from "config/db";
import homify from "core/homify";
import { createDebug } from "services/debug.service";
import config from "./config/config";
import app from "./config/express";

const log = createDebug("Server");

app.listen(config.port, async () => {
  log(`server started on port ${config.port} (${config.env})`);
  await mongoose.connect(`mongodb://${config.db}:${config.db_port}/${config.db_name}`, { useNewUrlParser: true });
  await homify.bootstrap();
});
export default app;
