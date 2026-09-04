const express = require('express');
const { Op } = require('sequelize');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Customer = require('../models/Customer');
const User = require('../models/User');
const Incentive = require('../models/Incentive');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// Sales Overview (Admin)
router.get('/sales', authenticateToken, authorizeRole(['admin']), asyncHandler(async (req, res) => {
  const totalOrders = await Order.count();
  const totalCrates = await Order.sum('crates');
  const totalRevenue = await Order.sum('total_amount');
  
  const deliveredOrders = await Order.count({ where: { status: 'delivered' } });
  const pendingOrders = await Order.count({ where: { status: 'pending' } });
  const approvedOrders = await Order.count({ where: { status: 'approved' } });
  
  res.json({
    totalOrders,
    totalCrates: totalCrates || 0,
    totalRevenue: totalRevenue || 0,
    deliveredOrders,
    pendingOrders,
    approvedOrders,
  });
}));

// Revenue Analytics (Admin)
router.get('/revenue', authenticateToken, authorizeRole(['admin']), asyncHandler(async (req, res) => {
  const orders = await Order.findAll({
    attributes: [
      'createdAt',
      [require('sequelize').fn('SUM', require('sequelize').col('total_amount')), 'dailyRevenue']
    ],
    group: [require('sequelize').fn('DATE', require('sequelize').col('createdAt'))],
    order: [['createdAt', 'DESC']],
  });
  
  res.json(orders);
}));

// Brand-wise Sales (Admin)
router.get('/brand', authenticateToken, authorizeRole(['admin']), asyncHandler(async (req, res) => {
  const brandSales = await Order.findAll({
    attributes: [
      [require('sequelize').col('Product.brand'), 'brand'],
      [require('sequelize').fn('SUM', require('sequelize').col('Order.crates')), 'totalCrates'],
      [require('sequelize').fn('SUM', require('sequelize').col('Order.total_amount')), 'totalRevenue'],
    ],
    include: [{ model: Product, attributes: [] }],
    group: ['Product.brand'],
    raw: true,
  });
  
  res.json(brandSales);
}));

// District-wise Sales (Admin)
router.get('/district', authenticateToken, authorizeRole(['admin']), asyncHandler(async (req, res) => {
  const districtSales = await Order.findAll({
    attributes: [
      [require('sequelize').col('Customer.district'), 'district'],
      [require('sequelize').fn('SUM', require('sequelize').col('Order.crates')), 'totalCrates'],
      [require('sequelize').fn('SUM', require('sequelize').col('Order.total_amount')), 'totalRevenue'],
      [require('sequelize').fn('COUNT', require('sequelize').col('Order.id')), 'orderCount'],
    ],
    include: [{ model: Customer, attributes: [] }],
    group: ['Customer.district'],
    raw: true,
  });
  
  res.json(districtSales);
}));

// Representative Performance (Admin)
router.get('/representative', authenticateToken, authorizeRole(['admin']), asyncHandler(async (req, res) => {
  const reps = await User.findAll({
    where: { role: 'representative' },
    attributes: ['id', 'name', 'district', 'target_crates', 'achieved_crates'],
  });
  
  const repPerformance = await Promise.all(
    reps.map(async (rep) => {
      const totalRevenue = await Order.sum('total_amount', { where: { representative_id: rep.id } });
      const totalOrders = await Order.count({ where: { representative_id: rep.id } });
      
      return {
        ...rep.toJSON(),
        totalRevenue: totalRevenue || 0,
        totalOrders,
        performancePercentage: rep.target_crates ? Math.round((rep.achieved_crates / rep.target_crates) * 100) : 0,
      };
    })
  );
  
  res.json(repPerformance);
}));

// Cash Flow Projection (Admin)
router.get('/cashflow', authenticateToken, authorizeRole(['admin']), asyncHandler(async (req, res) => {
  const orders = await Order.findAll({
    where: { status: 'delivered' },
    include: [{ model: Product, attributes: ['cost_per_crate', 'price_per_crate'] }],
  });
  
  let totalRevenue = 0;
  let totalCost = 0;
  
  orders.forEach(order => {
    totalRevenue += parseFloat(order.total_amount);
    totalCost += parseFloat(order.Product.cost_per_crate) * order.crates;
  });
  
  const totalIncentives = await Incentive.sum('amount', { where: { status: 'approved' } });
  const netProfit = totalRevenue - totalCost - (totalIncentives || 0);
  
  res.json({
    totalRevenue,
    totalCost,
    totalIncentives: totalIncentives || 0,
    netProfit,
  });
}));

module.exports = router;
