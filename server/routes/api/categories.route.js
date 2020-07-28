const express = require('express');
const categoryCtr = require('../../controllers/api/category.controller');
const createAuthenticationStrategy = require('../../middleware/createAuthenticationStrategy');
const createAuthorizationMiddleware = require('../../middleware/createAuthorizationMiddleware');

const router = express.Router();
const jwtAuthenticate = createAuthenticationStrategy('jwt');
const canReadCategory = createAuthorizationMiddleware('category', 'read');
const canUpdateCategory = createAuthorizationMiddleware('category', 'update');
const canDeleteCategory = createAuthorizationMiddleware('category', 'delete');
const canInsertCategory = createAuthorizationMiddleware('category', 'insert');

router.use(jwtAuthenticate);

// Preload user object on routes with ':categoryId'
router.param('categoryId', categoryCtr.preloadTargetCategory);

router.get('/', canReadCategory, categoryCtr.apiGetCategories);

// router.get('/:categoryId', canReadCategory, categoryCtr.apiGetCategory);

// router.put('/:categoryId', canUpdateCategory, categoryCtr.updateCategory);

// router.delete('/:categoryId', canDeleteCategory, categoryCtr.deleteCategory);

module.exports = router;
