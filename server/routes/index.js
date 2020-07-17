const express = require('express');
const createAuthenticationStrategy = require('../middleware/createAuthenticationStrategy');

const jwtAuthenticate = createAuthenticationStrategy('jwt');
const localAuthenticate = createAuthenticationStrategy('local');
const googleAuthenticate = createAuthenticationStrategy('google-token');
const facebookAuthenticate = createAuthenticationStrategy('facebook-token');

const apiRoutes = require('./api');
const authRoutes = require('./auth.route');
const usersRoutes = require('./users.route');
const categoriesRoutes = require('./categories.route');
const foodsRoutes = require('./foods.route');
const ordersRoutes = require('./orders.route');
const transactionsRoutes = require('./transactions.route');
const discountsRoutes = require('./discounts.route');
const settingsRoutes = require('./settings.route');

const dashboard_controller = require('../controllers/DashboardController');
// error_controller = require('../controllers/ErrorController');

const router = express.Router();

router.get('/', function(req, res) {
    dashboard_controller.index(req, res);
});

router.use('/api', apiRoutes);
router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/categories', categoriesRoutes);
router.use('/foods', foodsRoutes);
router.use('/orders', ordersRoutes);
router.use('/transactions', transactionsRoutes);
router.use('/discounts', discountsRoutes);
router.use('/settings', settingsRoutes);

module.exports = router;
