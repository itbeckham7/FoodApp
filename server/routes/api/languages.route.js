const express = require('express');
const languagesCtr = require('../../controllers/api/languages.controller');
const createAuthenticationStrategy = require('../../middleware/createAuthenticationStrategy');
const createAuthorizationMiddleware = require('../../middleware/createAuthorizationMiddleware');

const router = express.Router();

router.get('/', languagesCtr.apiGetLanguages);

module.exports = router;
