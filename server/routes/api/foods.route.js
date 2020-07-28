const express = require('express');
const foodsCtr = require('../../controllers/api/foods.controller');
const createAuthenticationStrategy = require('../../middleware/createAuthenticationStrategy');
const createAuthorizationMiddleware = require('../../middleware/createAuthorizationMiddleware');

const router = express.Router();
const jwtAuthenticate = createAuthenticationStrategy('jwt');
const canReadFood = createAuthorizationMiddleware('food', 'read');
const canUpdateFood = createAuthorizationMiddleware('food', 'update');
const canDeleteFood = createAuthorizationMiddleware('food', 'delete');
const canInsertFood = createAuthorizationMiddleware('food', 'insert');

router.use(jwtAuthenticate);

// Preload user object on routes with ':foodId'
router.param('foodId', foodsCtr.preloadTargetFood);

router.get('/', canReadFood, foodsCtr.apiGetFoods);

router.get('/slider', canReadFood, foodsCtr.apiGetSliderFoods);

router.get('/category/:categoryId', canReadFood, foodsCtr.apiGetFoodsFromCategory);

router.get('/:foodId', canReadFood, foodsCtr.apiGetFood);

// router.put('/:foodId', canUpdateFood, foodsCtr.updateFood);

// router.delete('/:foodId', canDeleteFood, foodsCtr.deleteFood);

module.exports = router;
