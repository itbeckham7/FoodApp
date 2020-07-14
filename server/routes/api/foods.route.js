const express = require('express');
const foodsCtr = require('../../controllers/api/foods.controller');
const createAuthenticationStrategy = require('../../middleware/createAuthenticationStrategy');
const createAuthorizationMiddleware = require('../../middleware/createAuthorizationMiddleware');

const router = express.Router();
const jwtAuthenticate = createAuthenticationStrategy('jwt');
const canReadFood = createAuthorizationMiddleware('food', 'read');
const canModifyFood = createAuthorizationMiddleware('food', 'modify');

router.use(jwtAuthenticate);

// Preload user object on routes with ':foodId'
router.param('foodId', foodsCtr.preloadTargetFood);

router.get('/', canReadFood, foodsCtr.apiGetFoods);

router.get('/category/:categoryId', canReadFood, foodsCtr.apiGetFoodsFromCategory);

router.get('/:foodId', canReadFood, foodsCtr.apiGetFood);

// router.put('/:foodId', canModifyFood, foodsCtr.updateFood);

// router.delete('/:foodId', canModifyFood, foodsCtr.deleteFood);

module.exports = router;
