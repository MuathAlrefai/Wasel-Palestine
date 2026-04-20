const { DataTypes } = require("sequelize");
const { USER_ROLES } = require("../constants/enums");

module.exports = (sequelize) =>
  sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      fullName: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
      passwordHash: { type: DataTypes.STRING, allowNull: false },
      role: { type: DataTypes.ENUM(...USER_ROLES), defaultValue: "USER" },
      isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    },
    { timestamps: true },
  );
