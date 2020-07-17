const express = require('express');
const authRoutes = require('./auth.route');
const profilesRoutes = require('./profiles.route');
const usersRoutes = require('./users.route');
const categoriesRoutes = require('./categories.route');
const foodsRoutes = require('./foods.route');
const discountsRoutes = require('./discounts.route');
const bagsRoutes = require('./bags.route');
const commentsRoutes = require('./comments.route');
const settingsRoutes = require('./settings.route');

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
router.use('/bags', bagsRoutes);
router.use('/comments', commentsRoutes);
router.use('/settings', settingsRoutes);

module.exports = router;
