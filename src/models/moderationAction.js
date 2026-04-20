const { DataTypes } = require("sequelize");
const {
  AUDIT_TARGET_TYPES,
  AUDIT_ACTION_TYPES,
} = require("../constants/enums");

module.exports = (sequelize) =>
  sequelize.define(
    "ModerationAction",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      targetType: {
        type: DataTypes.ENUM(...AUDIT_TARGET_TYPES),
        allowNull: false,
      },

      targetId: {
        type: DataTypes.UUID,
        allowNull: false,
      },

      actionType: {
        type: DataTypes.ENUM(...AUDIT_ACTION_TYPES),
        allowNull: false,
      },

      performedBy: {
        type: DataTypes.UUID,
        allowNull: false,
      },

      reason: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      metadataJson: {
        type: DataTypes.JSONB,
        defaultValue: {},
      },
    },
    {
      timestamps: true,
      updatedAt: false,
    },
  );
