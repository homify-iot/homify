import app from "./config/express";
import config from "./config/config";
import mongoose from "./config/db";

mongoose.connect(
  `mongodb://${config.db}:${config.db_port}/${config.db_name}`,
  { useNewUrlParser: true }
);
mongoose.connection
  .on("connected", () => {
    console.log(`Mongoose connection open on ${config.db}:${config.db_port}`);
  })
  .on("error", err => {
    console.log(`Connection error: ${err.message}`);
  });

// listen on port config.port
app.listen(config.port, () => {
  console.info(`server started on port ${config.port} (${config.env})`);
});
export default app;
