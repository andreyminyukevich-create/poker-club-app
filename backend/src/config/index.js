require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  botToken: process.env.BOT_TOKEN,
  appUrl: process.env.APP_URL,
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseKey: process.env.SUPABASE_KEY,
  allowedOrigins: process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map(s => s.trim())
    : ['*'],
  rateLimitWindow: 15 * 60 * 1000,
  rateLimitMax: 100,
};
