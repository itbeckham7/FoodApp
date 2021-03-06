const express = require('express');
const addressesCtr = require('../../controllers/api/addresses.controller');
const createAuthenticationStrategy = require('../../middleware/createAuthenticationStrategy');
const createAuthorizationMiddleware = require('../../middleware/createAuthorizationMiddleware');

const router = express.Router();
const jwtAuthenticate = createAuthenticationStrategy('jwt');
const canReadAddress = createAuthorizationMiddleware('address', 'read');
const canInsertAddress = createAuthorizationMiddleware('address', 'insert');
const canUpdateAddress = createAuthorizationMiddleware('address', 'update');
const canDeleteAddress = createAuthorizationMiddleware('address', 'delete');

router.use(jwtAuthenticate);

// Preload user object on routes with ':addressId'ks
router.param('addressId', addressesCtr.preloadTargetAddress);

router.get('/:userId', canReadAddress, addressesCtr.apiGetAddresses);

router.get('/getactive/:userId', canReadAddress, addressesCtr.apiGetActiveAddress);

router.get('/:addressId', canReadAddress, addressesCtr.apiGetAddress);

router.post('/add/:userId', canInsertAddress, addressesCtr.apiAddAddress);

router.put('/update/:addressId', canUpdateAddress, addressesCtr.apiUpdateAddress);

router.get('/updateactive/:userId/:addressId', canReadAddress, addressesCtr.apiUpdateActiveAddress);

router.delete('/delete/:userId/:addressId', canDeleteAddress, addressesCtr.apiDeleteAddress);

module.exports = router;
