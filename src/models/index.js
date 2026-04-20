const sequelize = require("../config/database");

const User = require("./user")(sequelize);
const RefreshToken = require("./refreshToken")(sequelize);
const Checkpoint = require("./checkpoint")(sequelize);
const CheckpointStatusHistory = require("./checkpointStatusHistory")(sequelize);
const Incident = require("./incident")(sequelize);
const Report = require("./report")(sequelize);
const ReportVote = require("./reportVote")(sequelize);
const AlertSubscription = require("./alertSubscription")(sequelize);
const Alert = require("./alert")(sequelize);
const ModerationAction = require("./moderationAction")(sequelize);

// Auth
User.hasMany(RefreshToken, { foreignKey: "userId" });
RefreshToken.belongsTo(User, { foreignKey: "userId" });

// Checkpoints
Checkpoint.hasMany(CheckpointStatusHistory, { foreignKey: "checkpointId" });
CheckpointStatusHistory.belongsTo(Checkpoint, { foreignKey: "checkpointId" });

Checkpoint.hasMany(Incident, { foreignKey: "checkpointId" });
Incident.belongsTo(Checkpoint, { foreignKey: "checkpointId" });

// Incidents
User.hasMany(Incident, { foreignKey: "createdBy", as: "createdIncidents" });
Incident.belongsTo(User, { foreignKey: "createdBy", as: "creator" });

User.hasMany(Incident, { foreignKey: "verifiedBy", as: "verifiedIncidents" });
Incident.belongsTo(User, { foreignKey: "verifiedBy", as: "verifier" });

User.hasMany(Incident, { foreignKey: "closedBy", as: "closedIncidents" });
Incident.belongsTo(User, { foreignKey: "closedBy", as: "closer" });

// Reports
User.hasMany(Report, { foreignKey: "userId" });
Report.belongsTo(User, { foreignKey: "userId" });

Report.hasMany(ReportVote, { foreignKey: "reportId" });
ReportVote.belongsTo(Report, { foreignKey: "reportId" });

User.hasMany(ReportVote, { foreignKey: "userId" });
ReportVote.belongsTo(User, { foreignKey: "userId" });

// Alert subscriptions
User.hasMany(AlertSubscription, { foreignKey: "userId" });
AlertSubscription.belongsTo(User, { foreignKey: "userId" });

// Alerts
Incident.hasMany(Alert, { foreignKey: "incidentId" });
Alert.belongsTo(Incident, { foreignKey: "incidentId" });

AlertSubscription.hasMany(Alert, { foreignKey: "subscriptionId" });
Alert.belongsTo(AlertSubscription, { foreignKey: "subscriptionId" });

// Audit / moderation actions
User.hasMany(ModerationAction, {
  foreignKey: "performedBy",
  as: "moderationActions",
});

ModerationAction.belongsTo(User, {
  foreignKey: "performedBy",
  as: "performer",
});

module.exports = {
  sequelize,
  User,
  RefreshToken,
  Checkpoint,
  CheckpointStatusHistory,
  Incident,
  Report,
  ReportVote,
  AlertSubscription,
  Alert,
  ModerationAction,
};
