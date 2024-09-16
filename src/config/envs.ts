import 'dotenv/config';
import * as joi from 'joi';

interface Envs {
  PORT: number;
  DATABASE_URL: string;
  DB_HOST: string;
  DB_PORT: string;
  DB_NAME: string;
  DB_USER: string;
  DB_PASS: string;
}

const envSchema = joi
  .object({
    PORT: joi.number().required(),
    DATABASE_URL: joi.string().required(),
    DB_HOST: joi.string().required(),
    DB_PORT: joi.string().required(),
    DB_NAME: joi.string().required(),
    DB_USER: joi.string().required(),
    DB_PASS: joi.string().required(),
  })
  .unknown();

const { error, value } = envSchema.validate({
  ...process.env
});

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export const envs: Envs = {
  PORT: value.PORT,
  DATABASE_URL: value.DATABASE_URL,
  DB_HOST: value.DB_HOST,
  DB_PORT: value.DB_PORT,
  DB_NAME: value.DB_NAME,
  DB_USER: value.DB_USER,
  DB_PASS: value.DB_PASS,
};
