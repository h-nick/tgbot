export default () => ({
  runtime: {
    PORT: parseInt(process.env.PORT, 10) || 3000,
    NODE_ENV: process.env.NODE_ENV || 'development',
  },
  api: {
    TG_API_KEY: process.env.TG_API_KEY,
    YT_API_KEY: process.env.YT_API_KET,
  },
  bot: {
    DEFAULT_GROUP_ID: parseInt(process.env.DEFAULT_GROUP_ID, 10),
    BOT_USERNAME: process.env.BOT_USERNAME,
    CENSOR_DURATION_MAX_VALUE: 300,
  },
});
