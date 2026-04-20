const { AlertSubscription, Alert } = require('../models');
const { success } = require('../utils/apiResponse');

exports.createSubscription = async (req, res) => {
  const subscription = await AlertSubscription.create({ ...req.body, userId: req.user.id });
  return success(res, subscription, 'Subscription created', 201);
};

exports.listMySubscriptions = async (req, res) => {
  const subscriptions = await AlertSubscription.findAll({ where: { userId: req.user.id } });
  return success(res, subscriptions);
};

exports.listMyAlerts = async (req, res) => {
  const subscriptions = await AlertSubscription.findAll({ where: { userId: req.user.id } });
  const ids = subscriptions.map((s) => s.id);
  const alerts = await Alert.findAll({ where: { subscriptionId: ids }, order: [['createdAt', 'DESC']] });
  return success(res, alerts);
};
