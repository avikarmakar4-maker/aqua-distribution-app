const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Order = require('./Order');

const Incentive = sequelize.define('Incentive', {
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
  order_id: {
    type: DataTypes.UUID,
    references: { model: 'Orders', key: 'id' },
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  reason: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('claimed', 'pending_approval', 'approved', 'rejected'),
    defaultValue: 'pending_approval',
  },
  approved_by: {
    type: DataTypes.UUID,
    references: { model: 'Users', key: 'id' },
  },
  approval_date: {
    type: DataTypes.DATE,
  },
}, {
  timestamps: true,
});

module.exports = Incentive;
