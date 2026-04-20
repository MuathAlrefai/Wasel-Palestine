const { DataTypes } = require('sequelize');

module.exports = (sequelize) => sequelize.define('ReportVote', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  reportId: { type: DataTypes.UUID, allowNull: false },
  userId: { type: DataTypes.UUID, allowNull: false },
  voteType: { type: DataTypes.ENUM('UP', 'DOWN'), allowNull: false }
}, { timestamps: true, updatedAt: false });
