const express = require('express');
const ordersCtr = require('../../controllers/api/orders.controller');
const createAuthenticationStrategy = require('../../middleware/createAuthenticationStrategy');
const createAuthorizationMiddleware = require('../../middleware/createAuthorizationMiddleware');

const router = express.Router();
const jwtAuthenticate = createAuthenticationStrategy('jwt');
const canReadOrder = createAuthorizationMiddleware('order', 'read');
const canUpdateOrder = createAuthorizationMiddleware('order', 'update');
const canDeleteOrder = createAuthorizationMiddleware('order', 'delete');
const canInsertOrder = createAuthorizationMiddleware('order', 'insert');

router.use(jwtAuthenticate);

// Preload user object on routes with ':orderId'ks
router.param('orderId', ordersCtr.preloadTargetOrder);

router.post('/datatable', canReadOrder, ordersCtr.apiGetOrdersDatatable);

router.get('/:userId', canReadOrder, ordersCtr.apiGetOrders);

router.get('/order/:orderId', canReadOrder, ordersCtr.apiGetOrder);

router.post('/add', canInsertOrder, ordersCtr.apiAddOrder);

router.post('/changestatus', canUpdateOrder, ordersCtr.apiChangeOrderStatus);

module.exports = router;
