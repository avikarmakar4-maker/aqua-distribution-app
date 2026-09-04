const express = require('express');
const { v4: uuidv4 } = require('uuid');
const Order = require('../models/Order');
const Customer = require('../models/Customer');
const Product = require('../models/Product');
const Incentive = require('../models/Incentive');
const User = require('../models/User');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// Create Order
router.post('/', authenticateToken, asyncHandler(async (req, res) => {
  const { customer_id, product_id, crates } = req.body;
  
  if (!customer_id || !product_id || !crates) {
    return res.status(400).json({ error: 'Customer, product, and crates are required' });
  }
  
  const customer = await Customer.findByPk(customer_id);
  if (!customer) {
    return res.status(404).json({ error: 'Customer not found' });
  }
  
  const product = await Product.findByPk(product_id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  
  const total_amount = parseFloat(product.price_per_crate) * parseInt(crates);
  const order_number = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  
  const order = await Order.create({
    order_number,
    representative_id: req.user.userId,
    customer_id,
    product_id,
    crates,
    total_amount,
    status: 'pending',
  });
  
  // Update representative's achieved crates
  const rep = await User.findByPk(req.user.userId);
  await rep.update({ achieved_crates: (rep.achieved_crates || 0) + parseInt(crates) });
  
  // Check incentive eligibility: New customer with ≥5 crates
  if (customer.is_new && parseInt(crates) >= 5 && customer.verification_status === 'approved') {
    await Incentive.create({
      representative_id: req.user.userId,
      order_id: order.id,
      amount: 25,
      reason: 'New customer incentive',
      status: 'pending_approval',
    });
  }
  
  res.status(201).json({ message: 'Order created successfully', order });
}));

// Get All Orders
router.get('/', authenticateToken, asyncHandler(async (req, res) => {
  const where = req.user.role === 'representative' ? { representative_id: req.user.userId } : {};
  
  const orders = await Order.findAll({
    where,
    include: [
      { model: Customer, attributes: ['id', 'name', 'phone'] },
      { model: Product, attributes: ['id', 'name', 'brand', 'volume'] },
      { association: 'representative', attributes: ['id', 'name', 'email'] }
    ],
  });
  
  res.json(orders);
}));

// Get Order by ID
router.get('/:id', authenticateToken, asyncHandler(async (req, res) => {
  const order = await Order.findByPk(req.params.id, {
    include: [
      { model: Customer, attributes: ['id', 'name', 'phone'] },
      { model: Product, attributes: ['id', 'name', 'brand', 'volume', 'price_per_crate'] },
      { association: 'representative', attributes: ['id', 'name', 'email'] }
    ]
  });
  
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  
  if (req.user.role === 'representative' && order.representative_id !== req.user.userId) {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  res.json(order);
}));

// Update Order Status (Admin only)
router.put('/:id', authenticateToken, authorizeRole(['admin']), asyncHandler(async (req, res) => {
  const { status } = req.body; // 'approved', 'delivered', 'cancelled'
  
  if (!['approved', 'delivered', 'cancelled'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }
  
  const order = await Order.findByPk(req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  
  await order.update({ status, delivery_date: status === 'delivered' ? new Date() : null });
  
  res.json({ message: `Order ${status} successfully`, order });
}));

// Get Orders by Status (Admin)
router.get('/status/:status', authenticateToken, authorizeRole(['admin']), asyncHandler(async (req, res) => {
  const orders = await Order.findAll({
    where: { status: req.params.status },
    include: [
      { model: Customer, attributes: ['id', 'name'] },
      { model: Product, attributes: ['id', 'name', 'brand'] },
      { association: 'representative', attributes: ['id', 'name'] }
    ],
  });
  
  res.json(orders);
}));

module.exports = router;
