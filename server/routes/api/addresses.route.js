const express = require('express');
const addressesCtr = require('../../controllers/api/addresses.controller');
const createAuthenticationStrategy = require('../../middleware/createAuthenticationStrategy');
const createAuthorizationMiddleware = require('../../middleware/createAuthorizationMiddleware');

const router = express.Router();
const jwtAuthenticate = createAuthenticationStrategy('jwt');
const canReadAddress = createAuthorizationMiddleware('address', 'read');
const canModifyAddress = createAuthorizationMiddleware('address', 'modify');

router.use(jwtAuthenticate);

// Preload user object on routes with ':addressId'ks
router.param('addressId', addressesCtr.preloadTargetAddress);

router.get('/:userId', canReadAddress, addressesCtr.apiGetAddresses);

router.get('/getactive/:userId', canReadAddress, addressesCtr.apiGetActiveAddress);

router.get('/:addressId', canReadAddress, addressesCtr.apiGetAddress);

router.post('/add/:userId', canModifyAddress, addressesCtr.apiAddAddress);

router.put('/update/:addressId', canModifyAddress, addressesCtr.apiUpdateAddress);

router.get('/updateactive/:userId/:addressId', canReadAddress, addressesCtr.apiUpdateActiveAddress);

router.delete('/delete/:userId/:addressId', canModifyAddress, addressesCtr.apiDeleteAddress);

module.exports = router;
