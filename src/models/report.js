const { DataTypes } = require("sequelize");
const {
  REPORT_CATEGORIES,
  REPORT_MODERATION_STATUSES,
} = require("../constants/enums");

module.exports = (sequelize) =>
  sequelize.define(
    "Report",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: { type: DataTypes.UUID, allowNull: true },
      category: {
        type: DataTypes.ENUM(...REPORT_CATEGORIES),
        allowNull: false,
      },
      description: { type: DataTypes.TEXT, allowNull: false },
      latitude: { type: DataTypes.FLOAT, allowNull: false },
      longitude: { type: DataTypes.FLOAT, allowNull: false },
      region: { type: DataTypes.STRING, allowNull: false },
      reportTime: { type: DataTypes.DATE, allowNull: false },
      moderationStatus: {
        type: DataTypes.ENUM(...REPORT_MODERATION_STATUSES),
        defaultValue: "PENDING",
      },
      duplicateScore: { type: DataTypes.FLOAT, defaultValue: 0 },
      abuseFlag: { type: DataTypes.BOOLEAN, defaultValue: false },
      confidenceScore: { type: DataTypes.FLOAT, defaultValue: 0.5 },
    },
    { timestamps: true },
  );
