const express = require('express');
const adminsCtr = require('../../controllers/api/admins.controller');
const createAuthenticationStrategy = require('../../middleware/createAuthenticationStrategy');
const createUserAuthorizationMiddleware = require('../../middleware/createUserAuthorizationMiddleware');

const router = express.Router();
const jwtAuthenticate = createAuthenticationStrategy('jwt');
const canReadAdmin = createUserAuthorizationMiddleware('read');

router.use(jwtAuthenticate);

// Preload admin object on routes with ':adminId'
router.param('adminId', adminsCtr.preloadTargetAdmin);

router.post('/', canReadAdmin, adminsCtr.apiGetAdmins);

module.exports = router;
