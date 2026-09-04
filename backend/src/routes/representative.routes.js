const express = require('express');
const User = require('../models/User');
const Order = require('../models/Order');
const Customer = require('../models/Customer');
const Incentive = require('../models/Incentive');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// Get All Representatives (Admin only)
router.get('/', authenticateToken, authorizeRole(['admin']), asyncHandler(async (req, res) => {
  const reps = await User.findAll({
    where: { role: 'representative' },
    attributes: { exclude: ['password'] }
  });
  
  res.json(reps);
}));

// Get Representative Details by ID
router.get('/:id', authenticateToken, asyncHandler(async (req, res) => {
  if (req.user.role === 'representative' && req.params.id !== req.user.userId) {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  const rep = await User.findByPk(req.params.id, {
    attributes: { exclude: ['password'] }
  });
  
  if (!rep || rep.role !== 'representative') {
    return res.status(404).json({ error: 'Representative not found' });
  }
  
  // Get performance metrics
  const totalOrders = await Order.count({ where: { representative_id: req.params.id } });
  const totalCrates = await Order.sum('crates', { where: { representative_id: req.params.id } });
  const totalRevenue = await Order.sum('total_amount', { where: { representative_id: req.params.id } });
  const totalCustomers = await Customer.count({ where: { representative_id: req.params.id } });
  const approvedIncentives = await Incentive.sum('amount', { 
    where: { representative_id: req.params.id, status: 'approved' }
  });
  
  res.json({
    ...rep.toJSON(),
    performance: {
      totalOrders,
      totalCrates: totalCrates || 0,
      totalRevenue: totalRevenue || 0,
      totalCustomers,
      approvedIncentives: approvedIncentives || 0,
    }
  });
}));

// Update Representative (Admin only)
router.put('/:id', authenticateToken, authorizeRole(['admin']), asyncHandler(async (req, res) => {
  const { target_crates, district, status } = req.body;
  
  const rep = await User.findByPk(req.params.id);
  if (!rep || rep.role !== 'representative') {
    return res.status(404).json({ error: 'Representative not found' });
  }
  
  await rep.update({
    ...(target_crates && { target_crates }),
    ...(district && { district }),
    ...(status && { status })
  });
  
  res.json({ message: 'Representative updated successfully', rep });
}));

// Get Representative's Customers
router.get('/:id/customers', authenticateToken, asyncHandler(async (req, res) => {
  if (req.user.role === 'representative' && req.params.id !== req.user.userId) {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  const customers = await Customer.findAll({
    where: { representative_id: req.params.id }
  });
  
  res.json(customers);
}));

// Get Representative's Orders
router.get('/:id/orders', authenticateToken, asyncHandler(async (req, res) => {
  if (req.user.role === 'representative' && req.params.id !== req.user.userId) {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  const orders = await Order.findAll({
    where: { representative_id: req.params.id },
    include: [
      { model: Customer, attributes: ['id', 'name', 'phone'] },
      { model: Product, attributes: ['id', 'name', 'brand'] }
    ]
  });
  
  res.json(orders);
}));

// Get Representative's Incentives
router.get('/:id/incentives', authenticateToken, asyncHandler(async (req, res) => {
  if (req.user.role === 'representative' && req.params.id !== req.user.userId) {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  const incentives = await Incentive.findAll({
    where: { representative_id: req.params.id }
  });
  
  res.json(incentives);
}));

// Suspend Representative (Admin only)
router.put('/:id/suspend', authenticateToken, authorizeRole(['admin']), asyncHandler(async (req, res) => {
  const rep = await User.findByPk(req.params.id);
  if (!rep || rep.role !== 'representative') {
    return res.status(404).json({ error: 'Representative not found' });
  }
  
  await rep.update({ status: 'suspended' });
  res.json({ message: 'Representative suspended', rep });
}));

// Activate Representative (Admin only)
router.put('/:id/activate', authenticateToken, authorizeRole(['admin']), asyncHandler(async (req, res) => {
  const rep = await User.findByPk(req.params.id);
  if (!rep || rep.role !== 'representative') {
    return res.status(404).json({ error: 'Representative not found' });
  }
  
  await rep.update({ status: 'active' });
  res.json({ message: 'Representative activated', rep });
}));

module.exports = router;
