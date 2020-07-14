const express = require('express');
const categoryCtr = require('../../controllers/api/category.controller');
const createAuthenticationStrategy = require('../../middleware/createAuthenticationStrategy');
const createAuthorizationMiddleware = require('../../middleware/createAuthorizationMiddleware');

const router = express.Router();
const jwtAuthenticate = createAuthenticationStrategy('jwt');
const canReadCategory = createAuthorizationMiddleware('category', 'read');
const canModifyCategory = createAuthorizationMiddleware('category', 'modify');

router.use(jwtAuthenticate);

// Preload user object on routes with ':categoryId'
router.param('categoryId', categoryCtr.preloadTargetCategory);

router.get('/', canReadCategory, categoryCtr.apiGetCategories);

// router.get('/:categoryId', canReadUser, categoryCtr.apiGetCategory);

// router.put('/:categoryId', canModifyUser, categoryCtr.updateCategory);

// router.delete('/:categoryId', canModifyUser, categoryCtr.deleteCategory);

module.exports = router;
