const express = require('express');
const bagsCtr = require('../../controllers/api/bags.controller');
const createAuthenticationStrategy = require('../../middleware/createAuthenticationStrategy');
const createAuthorizationMiddleware = require('../../middleware/createAuthorizationMiddleware');

const router = express.Router();
const jwtAuthenticate = createAuthenticationStrategy('jwt');
const canReadBag = createAuthorizationMiddleware('bag', 'read');
const canModifyBag = createAuthorizationMiddleware('bag', 'modify');

router.use(jwtAuthenticate);

router.post('/detailBags', bagsCtr.apiGetDetailBags);

module.exports = router;
