const { DataTypes } = require("sequelize");
const {
  INCIDENT_CATEGORIES,
  INCIDENT_SEVERITIES,
  INCIDENT_STATUSES,
  INCIDENT_SOURCE_TYPES,
} = require("../constants/enums");

module.exports = (sequelize) =>
  sequelize.define(
    "Incident",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      title: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.TEXT },
      category: {
        type: DataTypes.ENUM(...INCIDENT_CATEGORIES),
        allowNull: false,
      },
      severity: {
        type: DataTypes.ENUM(...INCIDENT_SEVERITIES),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM(...INCIDENT_STATUSES),
        defaultValue: "OPEN",
      },
      sourceType: {
        type: DataTypes.ENUM(...INCIDENT_SOURCE_TYPES),
        defaultValue: "MANUAL",
      },
      locationLat: { type: DataTypes.FLOAT, allowNull: false },
      locationLng: { type: DataTypes.FLOAT, allowNull: false },
      region: { type: DataTypes.STRING, allowNull: false },
      checkpointId: { type: DataTypes.UUID, allowNull: true },
      createdBy: { type: DataTypes.UUID, allowNull: true },
      verifiedBy: { type: DataTypes.UUID, allowNull: true },
      verifiedAt: { type: DataTypes.DATE, allowNull: true },
      closedBy: { type: DataTypes.UUID, allowNull: true },
      closedAt: { type: DataTypes.DATE, allowNull: true },
    },
    { timestamps: true },
  );
