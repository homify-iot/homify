import Joi from "joi";
import dotenv from "dotenv";
import components from "./components"

dotenv.config();

const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string()
    .allow(["development", "production", "test", "provision"])
    .default("development"),
  SERVER_PORT: Joi.number().default(3000),
  DB: Joi.string().default("mongo"),
  DB_NAME: Joi.string().default("homify"),
  DB_PORT: Joi.number().default(27017)
})
  .unknown()
  .required();

const { error, value: envVars } = Joi.validate(process.env, envVarsSchema);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  env: envVars.NODE_ENV,
  port: envVars.SERVER_PORT,
  db: envVars.DB,
  db_name: envVars.DB_NAME,
  db_port: envVars.DB_PORT,
  homify_config: components
};

export default config;
