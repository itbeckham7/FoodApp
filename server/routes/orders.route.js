const express = require('express');
const createAuthenticationStrategy = require('../middleware/createAuthenticationStrategy');

const router = express.Router();
const jwtAuthenticate = createAuthenticationStrategy('jwt');
const localAuthenticate = createAuthenticationStrategy('local');
const googleAuthenticate = createAuthenticationStrategy('google-token');
const facebookAuthenticate = createAuthenticationStrategy('facebook-token');

order_controller = require('../controllers/OrderController');

router.get('/', function(req, res, next) {
  order_controller.showOrders(req, res);
});

router.get('/add', function (req, res) {
  order_controller.showAddOrder(req, res);
});

module.exports = router;
