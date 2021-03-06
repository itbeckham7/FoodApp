const express = require('express');
const authRoutes = require('./auth.route');
const profilesRoutes = require('./profiles.route');
const usersRoutes = require('./users.route');
const adminsRoutes = require('./admins.route');
const categoriesRoutes = require('./categories.route');
const foodsRoutes = require('./foods.route');
const discountsRoutes = require('./discounts.route');
const branchesRoutes = require('./branches.route');
const bagsRoutes = require('./bags.route');
const commentsRoutes = require('./comments.route');
const addressesRoutes = require('./addresses.route');
const cardsRoutes = require('./cards.route');
const ordersRoutes = require('./orders.route');
const settingsRoutes = require('./settings.route');
const languagesRoutes = require('./languages.route');

const router = express.Router();

router.get('/alive', (req, res) => {
  res.status(200).json({ status: 'pass' });
});

router.use('/auth', authRoutes);
router.use('/profiles', profilesRoutes);
router.use('/users', usersRoutes);
router.use('/admins', adminsRoutes);
router.use('/categories', categoriesRoutes);
router.use('/foods', foodsRoutes);
router.use('/discounts', discountsRoutes);
router.use('/branches', branchesRoutes);
router.use('/bags', bagsRoutes);
router.use('/comments', commentsRoutes);
router.use('/addresses', addressesRoutes);
router.use('/cards', cardsRoutes);
router.use('/orders', ordersRoutes);
router.use('/settings', settingsRoutes);
router.use('/languages', languagesRoutes);

module.exports = router;
