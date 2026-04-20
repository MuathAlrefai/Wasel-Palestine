const { DataTypes } = require('sequelize');

module.exports = (sequelize) => sequelize.define('CheckpointStatusHistory', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  checkpointId: { type: DataTypes.UUID, allowNull: false },
  oldStatus: { type: DataTypes.STRING },
  newStatus: { type: DataTypes.STRING, allowNull: false },
  changedBy: { type: DataTypes.UUID },
  note: { type: DataTypes.TEXT }
}, { timestamps: true, updatedAt: false });
