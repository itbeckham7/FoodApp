const express = require('express');
const createAuthenticationStrategy = require('../middleware/createAuthenticationStrategy');

const router = express.Router();
const jwtAuthenticate = createAuthenticationStrategy('jwt');
const localAuthenticate = createAuthenticationStrategy('local');
const googleAuthenticate = createAuthenticationStrategy('google-token');
const facebookAuthenticate = createAuthenticationStrategy('facebook-token');

discount_controller = require('../controllers/DiscountController');

router.get('/', function(req, res, next) {
  discount_controller.showDiscounts(req, res);
});

router.get('/add', function (req, res) {
  discount_controller.showAddDiscount(req, res);
});

router.get('/edit/:discountId', function (req, res) {
  discount_controller.showEditDiscount(req, res);
});

router.post('/add', function (req, res) {
  discount_controller.createDiscount(req, res);
});

router.post('/update/:discountId', function (req, res) {
  discount_controller.updateDiscount(req, res);
});

router.get('/delete/:discountId', function (req, res) {
  discount_controller.deleteDiscount(req, res);
});

module.exports = router;
