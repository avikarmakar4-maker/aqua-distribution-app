const express = require('express');
const Notification = require('../models/Notification');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// Get Notifications for User
router.get('/', authenticateToken, asyncHandler(async (req, res) => {
  const notifications = await Notification.findAll({
    where: { user_id: req.user.userId },
    order: [['createdAt', 'DESC']],
  });
  
  res.json(notifications);
}));

// Get Unread Notifications Count
router.get('/unread/count', authenticateToken, asyncHandler(async (req, res) => {
  const unreadCount = await Notification.count({
    where: { user_id: req.user.userId, is_read: false }
  });
  
  res.json({ unreadCount });
}));

// Mark Notification as Read
router.put('/:id/read', authenticateToken, asyncHandler(async (req, res) => {
  const notification = await Notification.findByPk(req.params.id);
  
  if (!notification) {
    return res.status(404).json({ error: 'Notification not found' });
  }
  
  if (notification.user_id !== req.user.userId) {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  await notification.update({ is_read: true });
  res.json({ message: 'Notification marked as read', notification });
}));

// Mark All Notifications as Read
router.put('/read-all', authenticateToken, asyncHandler(async (req, res) => {
  await Notification.update(
    { is_read: true },
    { where: { user_id: req.user.userId, is_read: false } }
  );
  
  res.json({ message: 'All notifications marked as read' });
}));

// Get Notifications by Type
router.get('/type/:type', authenticateToken, asyncHandler(async (req, res) => {
  const notifications = await Notification.findAll({
    where: { user_id: req.user.userId, type: req.params.type },
    order: [['createdAt', 'DESC']],
  });
  
  res.json(notifications);
}));

// Delete Notification
router.delete('/:id', authenticateToken, asyncHandler(async (req, res) => {
  const notification = await Notification.findByPk(req.params.id);
  
  if (!notification) {
    return res.status(404).json({ error: 'Notification not found' });
  }
  
  if (notification.user_id !== req.user.userId) {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  await notification.destroy();
  res.json({ message: 'Notification deleted' });
}));

// Create Notification (Admin/System only)
router.post('/', authenticateToken, authorizeRole(['admin']), asyncHandler(async (req, res) => {
  const { user_id, title, message, type, reference_id } = req.body;
  
  if (!user_id || !title || !message || !type) {
    return res.status(400).json({ error: 'User ID, title, message, and type are required' });
  }
  
  const notification = await Notification.create({
    user_id,
    title,
    message,
    type,
    reference_id,
  });
  
  res.status(201).json(notification);
}));

module.exports = router;
