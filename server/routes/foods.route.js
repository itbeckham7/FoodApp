const express = require('express');
const createAuthenticationStrategy = require('../middleware/createAuthenticationStrategy');

const router = express.Router();
const jwtAuthenticate = createAuthenticationStrategy('jwt');
const localAuthenticate = createAuthenticationStrategy('local');
const googleAuthenticate = createAuthenticationStrategy('google-token');
const facebookAuthenticate = createAuthenticationStrategy('facebook-token');

food_controller = require('../controllers/FoodController');

router.get('/', function(req, res, next) {
  food_controller.showFoods(req, res);
});

router.get('/add', function (req, res) {
  food_controller.showAddFood(req, res);
});

router.get('/edit/:foodId', function (req, res) {
  food_controller.showEditFood(req, res);
});

router.post('/add', function (req, res) {
  console.log('-- add route')
  food_controller.createFood(req, res);
});

router.post('/update/:foodId', function (req, res) {
  food_controller.updateFood(req, res);
});

router.get('/delete/:foodId', function (req, res) {
  food_controller.deleteFood(req, res);
});

module.exports = router;

