const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define(
    "RefreshToken",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      tokenHash: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      revoked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    { timestamps: true },
  );
