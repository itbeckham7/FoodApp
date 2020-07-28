const express = require('express');
const cardsCtr = require('../../controllers/api/cards.controller');
const createAuthenticationStrategy = require('../../middleware/createAuthenticationStrategy');
const createAuthorizationMiddleware = require('../../middleware/createAuthorizationMiddleware');

const router = express.Router();
const jwtAuthenticate = createAuthenticationStrategy('jwt');
const canReadCard = createAuthorizationMiddleware('card', 'read');
const canUpdateCard = createAuthorizationMiddleware('card', 'update');
const canDeleteCard = createAuthorizationMiddleware('card', 'delete');
const canInsertCard = createAuthorizationMiddleware('card', 'insert');

router.use(jwtAuthenticate);

// Preload user object on routes with ':cardId'ks
router.param('cardId', cardsCtr.preloadTargetCard);

router.get('/:userId', canReadCard, cardsCtr.apiGetCards);

router.get('/getactive/:userId', canReadCard, cardsCtr.apiGetActiveCard);

router.get('/:cardId', canReadCard, cardsCtr.apiGetCard);

router.post('/add/:userId', canInsertCard, cardsCtr.apiAddCard);

router.put('/update/:cardId', canUpdateCard, cardsCtr.apiUpdateCard);

router.get('/updateactive/:userId/:cardId', canUpdateCard, cardsCtr.apiUpdateActiveCard);

router.delete('/delete/:userId/:cardId', canDeleteCard, cardsCtr.apiDeleteCard);

module.exports = router;
