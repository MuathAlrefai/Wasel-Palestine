const axios = require("axios");
const { Incident } = require("../models");
const { success } = require("../utils/apiResponse");

function haversineKm(origin, destination) {
  const R = 6371;
  const dLat = ((destination.lat - origin.lat) * Math.PI) / 180;
  const dLng = ((destination.lng - origin.lng) * Math.PI) / 180;

  const lat1 = (origin.lat * Math.PI) / 180;
  const lat2 = (destination.lat * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

async function getOsrmRoute(origin, destination) {
  const routingBaseUrl =
    process.env.ROUTING_API_URL || "https://router.project-osrm.org";

  const url = `${routingBaseUrl}/route/v1/driving/${origin.lng},${origin.lat};${destination.lng},${destination.lat}`;

  const response = await axios.get(url, {
    timeout: 5000,
    params: {
      overview: "false",
      alternatives: "false",
      steps: "false",
    },
  });

  const route = response.data.routes?.[0];

  if (!route) {
    throw new Error("No route returned from OSRM");
  }

  return {
    distanceKm: Number((route.distance / 1000).toFixed(2)),
    durationMinutes: Math.ceil(route.duration / 60),
    provider: "OSRM",
  };
}

async function getWeather(origin) {
  const weatherBaseUrl =
    process.env.WEATHER_API_URL || "https://api.open-meteo.com/v1/forecast";

  const response = await axios.get(weatherBaseUrl, {
    timeout: 5000,
    params: {
      latitude: origin.lat,
      longitude: origin.lng,
      current: "temperature_2m,weather_code,wind_speed_10m",
    },
  });

  return response.data.current || null;
}

exports.estimate = async (req, res, next) => {
  try {
    const {
      origin,
      destination,
      avoidCheckpoints = false,
      avoidAreas = [],
    } = req.body;

    let routeData;
    let routeFallbackUsed = false;
    let weather = null;
    let weatherFallbackUsed = false;

    try {
      routeData = await getOsrmRoute(origin, destination);
    } catch (err) {
      routeFallbackUsed = true;

      const fallbackDistanceKm = haversineKm(origin, destination);

      routeData = {
        distanceKm: Number(fallbackDistanceKm.toFixed(2)),
        durationMinutes: Math.ceil((fallbackDistanceKm / 45) * 60),
        provider: "HEURISTIC_FALLBACK",
      };
    }

    try {
      weather = await getWeather(origin);
    } catch (err) {
      weatherFallbackUsed = true;
      weather = null;
    }

    const activeIncidents = await Incident.count({
      where: {
        region: avoidAreas?.[0] || "Nablus",
        status: "OPEN",
      },
    });

    let estimatedDurationMinutes = routeData.durationMinutes;
    const notes = [];

    if (avoidCheckpoints) {
      estimatedDurationMinutes += 10;
      notes.push("Checkpoint avoidance penalty applied");
    }

    if (activeIncidents > 0) {
      estimatedDurationMinutes += activeIncidents * 5;
      notes.push(
        "Duration adjusted due to active incidents in selected region",
      );
    }

    if (routeFallbackUsed) {
      notes.push(
        "External routing service unavailable; heuristic distance estimate used",
      );
    }

    if (weatherFallbackUsed) {
      notes.push(
        "Weather service unavailable; route estimated without weather data",
      );
    }

    return success(
      res,
      {
        estimatedDistanceKm: routeData.distanceKm,
        estimatedDurationMinutes,
        metadata: {
          provider: routeData.provider,
          incidentCountAlongRoute: activeIncidents,
          checkpointPenaltyApplied: Boolean(avoidCheckpoints),
          avoidAreas,
          notes,
          weather,
        },
      },
      "Route estimated",
    );
  } catch (err) {
    next(err);
  }
};
