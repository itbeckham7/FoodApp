const express = require('express');
const discountsCtr = require('../../controllers/api/discounts.controller');
const createAuthenticationStrategy = require('../../middleware/createAuthenticationStrategy');
const createAuthorizationMiddleware = require('../../middleware/createAuthorizationMiddleware');

const router = express.Router();
const jwtAuthenticate = createAuthenticationStrategy('jwt');
const canReadDiscount = createAuthorizationMiddleware('discount', 'read');
const canModifyDiscount = createAuthorizationMiddleware('discount', 'modify');

router.use(jwtAuthenticate);

// Preload user object on routes with ':discountId'
router.param('discountId', discountsCtr.preloadTargetDiscount);

router.post('/', canReadDiscount, discountsCtr.apiGetDiscounts);

// router.get('/:discountId', canReadUser, discountsCtr.apiGetDiscount);

// router.put('/:discountId', canModifyUser, discountsCtr.updateDiscount);

// router.delete('/:discountId', canModifyUser, discountsCtr.deleteDiscount);

module.exports = router;
