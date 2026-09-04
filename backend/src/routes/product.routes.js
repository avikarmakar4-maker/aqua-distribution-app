const express = require('express');
const Product = require('../models/Product');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// Seed Products (Admin only)
router.post('/seed', authenticateToken, authorizeRole(['admin']), asyncHandler(async (req, res) => {
  const products = [
    { name: 'Aquinne 300ml', brand: 'Aquinne', volume: '300ml', price_per_crate: 450, cost_per_crate: 300 },
    { name: 'Aquinne 500ml', brand: 'Aquinne', volume: '500ml', price_per_crate: 600, cost_per_crate: 400 },
    { name: 'Aquinne 1Ltr', brand: 'Aquinne', volume: '1Ltr', price_per_crate: 800, cost_per_crate: 500 },
    { name: 'Aquinne 2Ltrs', brand: 'Aquinne', volume: '2Ltrs', price_per_crate: 1200, cost_per_crate: 700 },
    { name: 'Aqua Diamond 500ml', brand: 'Aqua Diamond', volume: '500ml', price_per_crate: 700, cost_per_crate: 450 },
    { name: 'Aqua Diamond 1Ltr', brand: 'Aqua Diamond', volume: '1Ltr', price_per_crate: 950, cost_per_crate: 600 },
    { name: 'Aqua Diamond 2Ltrs', brand: 'Aqua Diamond', volume: '2Ltrs', price_per_crate: 1400, cost_per_crate: 850 },
    { name: 'Aqua Diamond 5Ltrs', brand: 'Aqua Diamond', volume: '5Ltrs', price_per_crate: 2500, cost_per_crate: 1500 },
    { name: 'Aqua Diamond 20Ltrs', brand: 'Aqua Diamond', volume: '20Ltrs', price_per_crate: 6000, cost_per_crate: 3500 },
    { name: 'Amrut 20Ltrs', brand: 'Amrut', volume: '20Ltrs', price_per_crate: 5000, cost_per_crate: 3000 },
  ];

  await Product.bulkCreate(products, { ignoreDuplicates: true });
  res.json({ message: 'Products seeded successfully', count: products.length });
}));

// Get All Products
router.get('/', asyncHandler(async (req, res) => {
  const products = await Product.findAll({ where: { status: 'active' } });
  res.json(products);
}));

// Get Product by ID
router.get('/:id', asyncHandler(async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
}));

// Create Product (Admin only)
router.post('/', authenticateToken, authorizeRole(['admin']), asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
}));

// Update Product (Admin only)
router.put('/:id', authenticateToken, authorizeRole(['admin']), asyncHandler(async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  await product.update(req.body);
  res.json(product);
}));

// Delete Product (Admin only)
router.delete('/:id', authenticateToken, authorizeRole(['admin']), asyncHandler(async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  await product.update({ status: 'inactive' });
  res.json({ message: 'Product deleted successfully' });
}));

module.exports = router;
