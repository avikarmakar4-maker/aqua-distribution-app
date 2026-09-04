const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  brand: {
    type: DataTypes.ENUM('Aquinne', 'Aqua Diamond', 'Amrut'),
    allowNull: false,
  },
  volume: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price_per_crate: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  cost_per_crate: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'active',
  },
}, {
  timestamps: true,
});

module.exports = Product;
