const axios = require('axios');
const env = require('../config/env');

exports.getWeatherContext = async (lat, lng) => {
  const response = await axios.get(env.externalApis.weatherBaseUrl, {
    params: {
      latitude: lat,
      longitude: lng,
      current: 'temperature_2m,weather_code,wind_speed_10m'
    },
    timeout: 5000
  });

  return response.data.current || {};
};
