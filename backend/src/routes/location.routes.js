const express = require('express');
const Location = require('../models/Location');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// Record Location (Representative)
router.post('/track', authenticateToken, authorizeRole(['representative']), asyncHandler(async (req, res) => {
  const { latitude, longitude, accuracy } = req.body;
  
  if (!latitude || !longitude) {
    return res.status(400).json({ error: 'Latitude and longitude are required' });
  }
  
  const location = await Location.create({
    representative_id: req.user.userId,
    latitude,
    longitude,
    accuracy,
    timestamp: new Date(),
  });
  
  res.status(201).json({ message: 'Location recorded', location });
}));

// Get Route History (Representative's own or Admin can see all)
router.get('/history/:repId', authenticateToken, asyncHandler(async (req, res) => {
  if (req.user.role === 'representative' && req.params.repId !== req.user.userId) {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  const { startDate, endDate } = req.query;
  const where = { representative_id: req.params.repId };
  
  if (startDate && endDate) {
    where.timestamp = {
      [require('sequelize').Op.between]: [new Date(startDate), new Date(endDate)]
    };
  }
  
  const locations = await Location.findAll({
    where,
    order: [['timestamp', 'ASC']],
  });
  
  res.json(locations);
}));

// Get Live Locations of All Representatives (Admin only)
router.get('/live/all', authenticateToken, authorizeRole(['admin']), asyncHandler(async (req, res) => {
  const locations = await Location.findAll({
    attributes: ['representative_id', 'latitude', 'longitude', 'timestamp'],
    order: [['timestamp', 'DESC']],
    raw: true,
  });
  
  // Group by representative and get latest location
  const latestLocations = {};
  locations.forEach(loc => {
    if (!latestLocations[loc.representative_id]) {
      latestLocations[loc.representative_id] = loc;
    }
  });
  
  res.json(Object.values(latestLocations));
}));

// Get Specific Representative Live Location (Admin)
router.get('/live/:repId', authenticateToken, authorizeRole(['admin']), asyncHandler(async (req, res) => {
  const location = await Location.findOne({
    where: { representative_id: req.params.repId },
    order: [['timestamp', 'DESC']],
  });
  
  if (!location) {
    return res.status(404).json({ error: 'No location found' });
  }
  
  res.json(location);
}));

module.exports = router;
