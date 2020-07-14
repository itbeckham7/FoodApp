const express = require('express');
const authRoutes = require('./auth.route');
const profilesRoutes = require('./profiles.route');
const usersRoutes = require('./users.route');
const categoriesRoutes = require('./categories.route');
const foodsRoutes = require('./foods.route');
const discountsRoutes = require('./discounts.route');

const router = express.Router();

router.get('/alive', (req, res) => {
  res.status(200).json({ status: 'pass' });
});

router.use('/auth', authRoutes);
router.use('/profiles', profilesRoutes);
router.use('/users', usersRoutes);
router.use('/categories', categoriesRoutes);
router.use('/foods', foodsRoutes);
router.use('/discounts', discountsRoutes);

module.exports = router;
