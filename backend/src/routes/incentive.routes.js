const express = require('express');
const Incentive = require('../models/Incentive');
const User = require('../models/User');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// Get Incentives for Representative
router.get('/', authenticateToken, asyncHandler(async (req, res) => {
  const where = req.user.role === 'representative' ? { representative_id: req.user.userId } : {};
  
  const incentives = await Incentive.findAll({
    where,
    include: [
      { association: 'representative', attributes: ['id', 'name', 'email'] },
      { association: 'approver', attributes: ['id', 'name'] }
    ],
  });
  
  res.json(incentives);
}));

// Claim Incentive (Representative)
router.post('/claim', authenticateToken, authorizeRole(['representative']), asyncHandler(async (req, res) => {
  const { order_id, amount, reason } = req.body;
  
  if (!order_id || !amount || !reason) {
    return res.status(400).json({ error: 'Order ID, amount, and reason are required' });
  }
  
  const incentive = await Incentive.create({
    representative_id: req.user.userId,
    order_id,
    amount,
    reason,
    status: 'pending_approval',
  });
  
  res.status(201).json({ message: 'Incentive claimed successfully', incentive });
}));

// Get Pending Incentives (Admin)
router.get('/pending', authenticateToken, authorizeRole(['admin']), asyncHandler(async (req, res) => {
  const incentives = await Incentive.findAll({
    where: { status: 'pending_approval' },
    include: [
      { association: 'representative', attributes: ['id', 'name', 'email'] }
    ],
  });
  
  res.json(incentives);
}));

// Approve/Reject Incentive (Admin)
router.put('/:id', authenticateToken, authorizeRole(['admin']), asyncHandler(async (req, res) => {
  const { status } = req.body; // 'approved' or 'rejected'
  
  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }
  
  const incentive = await Incentive.findByPk(req.params.id);
  if (!incentive) {
    return res.status(404).json({ error: 'Incentive not found' });
  }
  
  await incentive.update({ 
    status,
    approved_by: req.user.userId,
    approval_date: new Date()
  });
  
  res.json({ message: `Incentive ${status} successfully`, incentive });
}));

// Get Incentive by ID
router.get('/:id', authenticateToken, asyncHandler(async (req, res) => {
  const incentive = await Incentive.findByPk(req.params.id, {
    include: [
      { association: 'representative', attributes: ['id', 'name', 'email'] },
      { association: 'approver', attributes: ['id', 'name'] }
    ]
  });
  
  if (!incentive) {
    return res.status(404).json({ error: 'Incentive not found' });
  }
  
  if (req.user.role === 'representative' && incentive.representative_id !== req.user.userId) {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  res.json(incentive);
}));

module.exports = router;
