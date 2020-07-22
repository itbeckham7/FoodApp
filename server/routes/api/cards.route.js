const express = require('express');
const cardsCtr = require('../../controllers/api/cards.controller');
const createAuthenticationStrategy = require('../../middleware/createAuthenticationStrategy');
const createAuthorizationMiddleware = require('../../middleware/createAuthorizationMiddleware');

const router = express.Router();
const jwtAuthenticate = createAuthenticationStrategy('jwt');
const canReadCard = createAuthorizationMiddleware('card', 'read');
const canModifyCard = createAuthorizationMiddleware('card', 'modify');

router.use(jwtAuthenticate);

// Preload user object on routes with ':cardId'ks
router.param('cardId', cardsCtr.preloadTargetCard);

router.get('/:userId', canReadCard, cardsCtr.apiGetCards);

router.get('/getactive/:userId', canReadCard, cardsCtr.apiGetActiveCard);

router.get('/:cardId', canReadCard, cardsCtr.apiGetCard);

router.post('/add/:userId', canModifyCard, cardsCtr.apiAddCard);

router.put('/update/:cardId', canModifyCard, cardsCtr.apiUpdateCard);

router.get('/updateactive/:userId/:cardId', canReadCard, cardsCtr.apiUpdateActiveCard);

router.delete('/delete/:userId/:cardId', canModifyCard, cardsCtr.apiDeleteCard);

module.exports = router;
