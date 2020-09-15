export default () => ({
  runtime: {
    PORT: parseInt(process.env.PORT, 10) || 3000,
    NODE_ENV: process.env.NODE_ENV || 'development',
  },
  api: {
    TG_API_KEY: process.env.TG_API_KEY,
    YT_API_KEY: process.env.YT_API_KET,
    FIREBASE_URL: process.env.FIREBASE_URL,
  },
  bot: {
    DEFAULT_GROUP_ID: parseInt(process.env.DEFAULT_GROUP_ID, 10),
    BOT_USERNAME: process.env.BOT_USERNAME,
    BOT_NAME: process.env.BOT_NAME,
    CENSOR_DURATION_MAX_VALUE: 300,
    BOT_LANG: process.env.BOT_LANG || 'en',
  },
});
