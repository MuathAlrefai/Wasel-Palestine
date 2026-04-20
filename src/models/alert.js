const { DataTypes } = require("sequelize");
const { ALERT_STATUSES } = require("../constants/enums");

module.exports = (sequelize) =>
  sequelize.define(
    "Alert",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      incidentId: { type: DataTypes.UUID, allowNull: false },
      subscriptionId: { type: DataTypes.UUID, allowNull: false },
      status: {
        type: DataTypes.ENUM(...ALERT_STATUSES),
        defaultValue: "READY",
      },
      payloadJson: { type: DataTypes.JSONB, defaultValue: {} },
    },
    { timestamps: true },
  );
