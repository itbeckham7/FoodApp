const express = require('express');
const settingsCtr = require('../../controllers/api/settings.controller');
const createAuthenticationStrategy = require('../../middleware/createAuthenticationStrategy');
const createAuthorizationMiddleware = require('../../middleware/createAuthorizationMiddleware');

const router = express.Router();
const jwtAuthenticate = createAuthenticationStrategy('jwt');
const canReadSetting = createAuthorizationMiddleware('setting', 'read');
const canUpdateSetting = createAuthorizationMiddleware('setting', 'update');
const canDeleteSetting = createAuthorizationMiddleware('setting', 'delete');
const canInsertSetting = createAuthorizationMiddleware('setting', 'insert');

// Preload user object on routes with ':settingId'
router.param('settingId', settingsCtr.preloadTargetSetting);

router.get('/', settingsCtr.apiGetSetting);

// router.get('/:settingId', canReadSetting, settingsCtr.apiGetSetting);

// router.put('/:settingId', canUpdateSetting, settingsCtr.updateSetting);

// router.delete('/:settingId', canDeleteSetting, settingsCtr.deleteSetting);

module.exports = router;
