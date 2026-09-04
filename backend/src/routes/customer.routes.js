const express = require('express');
const Customer = require('../models/Customer');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// Get All Customers for a Representative
router.get('/', authenticateToken, asyncHandler(async (req, res) => {
  const where = req.user.role === 'representative' ? { representative_id: req.user.userId } : {};
  const customers = await Customer.findAll({ where });
  res.json(customers);
}));

// Get Pending Customers (Admin only)
router.get('/pending', authenticateToken, authorizeRole(['admin']), asyncHandler(async (req, res) => {
  const customers = await Customer.findAll({ 
    where: { verification_status: 'pending' },
    include: [{ association: 'representative', attributes: ['id', 'name', 'email'] }]
  });
  res.json(customers);
}));

// Get Customer by ID
router.get('/:id', authenticateToken, asyncHandler(async (req, res) => {
  const customer = await Customer.findByPk(req.params.id);
  if (!customer) {
    return res.status(404).json({ error: 'Customer not found' });
  }
  
  if (req.user.role === 'representative' && customer.representative_id !== req.user.userId) {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  res.json(customer);
}));

// Create New Customer
router.post('/', authenticateToken, asyncHandler(async (req, res) => {
  const { name, email, phone, address, district, latitude, longitude, photo_url } = req.body;
  
  if (!name || !phone) {
    return res.status(400).json({ error: 'Name and phone are required' });
  }
  
  const customer = await Customer.create({
    name,
    email,
    phone,
    address,
    district,
    latitude,
    longitude,
    photo_url,
    representative_id: req.user.userId,
    created_by: req.user.userId,
    is_new: true,
    verification_status: 'pending',
  });
  
  res.status(201).json(customer);
}));

// Verify Customer (Admin only)
router.put('/:id/verify', authenticateToken, authorizeRole(['admin']), asyncHandler(async (req, res) => {
  const { status } = req.body; // 'approved' or 'rejected'
  
  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }
  
  const customer = await Customer.findByPk(req.params.id);
  if (!customer) {
    return res.status(404).json({ error: 'Customer not found' });
  }
  
  await customer.update({ verification_status: status });
  res.json({ message: `Customer ${status} successfully`, customer });
}));

// Update Customer
router.put('/:id', authenticateToken, asyncHandler(async (req, res) => {
  const customer = await Customer.findByPk(req.params.id);
  if (!customer) {
    return res.status(404).json({ error: 'Customer not found' });
  }
  
  if (req.user.role === 'representative' && customer.representative_id !== req.user.userId) {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  await customer.update(req.body);
  res.json(customer);
}));

module.exports = router;
