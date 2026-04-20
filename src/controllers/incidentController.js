const { Incident, AlertSubscription, Alert } = require('../models');
const { success, error } = require('../utils/apiResponse');

exports.createIncident = async (req, res) => {
  const incident = await Incident.create({ ...req.body, createdBy: req.user.id });

  const subscriptions = await AlertSubscription.findAll({
    where: { region: incident.region, isActive: true }
  });

  for (const subscription of subscriptions) {
    if (!subscription.category || subscription.category === incident.category) {
      await Alert.create({
        incidentId: incident.id,
        subscriptionId: subscription.id,
        payloadJson: {
          incidentTitle: incident.title,
          region: incident.region,
          category: incident.category
        }
      });
    }
  }

  return success(res, incident, 'Incident created', 201);
};

exports.listIncidents = async (req, res) => {
  const { category, severity, status, region, page = 1, size = 10 } = req.query;
  const where = {};
  if (category) where.category = category;
  if (severity) where.severity = severity;
  if (status) where.status = status;
  if (region) where.region = region;

  const result = await Incident.findAndCountAll({
    where,
    limit: Number(size),
    offset: (Number(page) - 1) * Number(size),
    order: [['createdAt', 'DESC']]
  });

  return success(res, {
    items: result.rows,
    total: result.count,
    page: Number(page),
    size: Number(size)
  });
};

exports.verifyIncident = async (req, res) => {
  const incident = await Incident.findByPk(req.params.id);
  if (!incident) return error(res, 'Incident not found', 404);

  incident.status = 'VERIFIED';
  incident.verifiedBy = req.user.id;
  incident.verifiedAt = new Date();
  await incident.save();

  return success(res, incident, 'Incident verified');
};

exports.closeIncident = async (req, res) => {
  const incident = await Incident.findByPk(req.params.id);
  if (!incident) return error(res, 'Incident not found', 404);

  incident.status = 'CLOSED';
  incident.closedBy = req.user.id;
  incident.closedAt = new Date();
  await incident.save();

  return success(res, incident, 'Incident closed');
};
