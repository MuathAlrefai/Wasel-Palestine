const { ModerationAction } = require("../models");

async function logAction({
  targetType,
  targetId,
  actionType,
  performedBy,
  reason = null,
  metadataJson = {},
}) {
  return ModerationAction.create({
    targetType,
    targetId,
    actionType,
    performedBy,
    reason,
    metadataJson,
  });
}

module.exports = {
  logAction,
};
