export default () => ({
  NODE_ENV: process.env.NODE_ENV,
  BASE_URL: process.env.BASE_URL,
  PORT: parseInt(process.env.PORT ?? '50007', 10),
  KAFKA_BROKER: process.env.KAFKA_BROKER,
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
  SENDGRID_FROM_EMAIL: process.env.SENDGRID_FROM_EMAIL,
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
  TWILIO_SMS_FROM: process.env.TWILIO_SMS_FROM,
});
