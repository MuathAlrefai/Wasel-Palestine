const { DataTypes } = require("sequelize");
const { CHECKPOINT_STATUSES } = require("../constants/enums");

module.exports = (sequelize) =>
  sequelize.define(
    "Checkpoint",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: { type: DataTypes.STRING, allowNull: false },
      latitude: { type: DataTypes.FLOAT, allowNull: false },
      longitude: { type: DataTypes.FLOAT, allowNull: false },
      region: { type: DataTypes.STRING, allowNull: false },
      statusCurrent: {
        type: DataTypes.ENUM(...CHECKPOINT_STATUSES),
        defaultValue: "OPEN",
      },
      description: { type: DataTypes.TEXT },
    },
    { timestamps: true },
  );
