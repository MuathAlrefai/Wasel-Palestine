require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    name: process.env.DB_NAME || 'wasel_db',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres'
  },
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || 'change_access_secret',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'change_refresh_secret',
    accessExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d'
  },
  externalApis: {
    routingBaseUrl: process.env.ROUTING_API_URL || 'https://router.project-osrm.org',
    weatherBaseUrl: process.env.WEATHER_API_URL || 'https://api.open-meteo.com/v1/forecast'
  }
};
