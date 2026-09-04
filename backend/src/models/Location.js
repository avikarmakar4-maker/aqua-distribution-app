const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Location = sequelize.define('Location', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  representative_id: {
    type: DataTypes.UUID,
    references: { model: 'Users', key: 'id' },
    allowNull: false,
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: false,
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: false,
  },
  accuracy: {
    type: DataTypes.FLOAT,
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  timestamps: true,
});

module.exports = Location;
