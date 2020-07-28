const express = require('express');
const discountsCtr = require('../../controllers/api/discounts.controller');
const createAuthenticationStrategy = require('../../middleware/createAuthenticationStrategy');
const createAuthorizationMiddleware = require('../../middleware/createAuthorizationMiddleware');

const router = express.Router();
const jwtAuthenticate = createAuthenticationStrategy('jwt');
const canReadDiscount = createAuthorizationMiddleware('discount', 'read');
const canUpdateDiscount = createAuthorizationMiddleware('discount', 'update');
const canDeleteDiscount = createAuthorizationMiddleware('discount', 'delete');
const canInsertDiscount = createAuthorizationMiddleware('discount', 'insert');

router.use(jwtAuthenticate);

// Preload user object on routes with ':discountId'
router.param('discountId', discountsCtr.preloadTargetDiscount);

router.post('/', canReadDiscount, discountsCtr.apiGetDiscounts);

// router.get('/:discountId', canReadDiscount, discountsCtr.apiGetDiscount);

// router.put('/:discountId', canUpdateDiscount, discountsCtr.updateDiscount);

// router.delete('/:discountId', canDeleteDiscount, discountsCtr.deleteDiscount);

module.exports = router;
