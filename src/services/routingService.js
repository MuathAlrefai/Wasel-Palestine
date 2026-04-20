const axios = require('axios');
const env = require('../config/env');
const { Incident } = require('../models');

exports.estimateRoute = async ({ origin, destination, avoidCheckpoints, avoidAreas = [] }) => {
  const url = `${env.externalApis.routingBaseUrl}/route/v1/driving/${origin.lng},${origin.lat};${destination.lng},${destination.lat}?overview=false`;
  const routeResponse = await axios.get(url, { timeout: 5000 });
  const route = routeResponse.data.routes?.[0];

  if (!route) {
    throw new Error('Unable to estimate route from provider');
  }

  const activeIncidents = await Incident.count({
    where: { status: ['OPEN', 'VERIFIED'], region: avoidAreas.length ? avoidAreas[0] : 'Nablus' }
  });

  let durationMinutes = Math.round(route.duration / 60);
  const metadata = {
    provider: 'OSRM',
    incidentCountAlongRoute: activeIncidents,
    checkpointPenaltyApplied: Boolean(avoidCheckpoints),
    avoidAreas,
    notes: []
  };

  if (avoidCheckpoints) {
    durationMinutes += 10;
    metadata.notes.push('Checkpoint avoidance penalty applied');
  }

  if (activeIncidents > 0) {
    durationMinutes += activeIncidents * 3;
    metadata.notes.push('Duration adjusted due to active incidents in selected region');
  }

  return {
    estimatedDistanceKm: Number((route.distance / 1000).toFixed(2)),
    estimatedDurationMinutes: durationMinutes,
    metadata
  };
};
