import * as Joi from 'joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .required(),
  BASE_URL: Joi.string().required(),
  PORT: Joi.number().port().required(),
  KAFKA_BROKER: Joi.string().required(),
  SENDGRID_API_KEY: Joi.string().required(),
  SENDGRID_FROM_EMAIL: Joi.string().email().required(),
  TWILIO_ACCOUNT_SID: Joi.string().required(),
  TWILIO_AUTH_TOKEN: Joi.string().required(),
  TWILIO_SMS_FROM: Joi.string().required(),
});
