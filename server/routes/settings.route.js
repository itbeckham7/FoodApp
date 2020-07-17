const express = require('express');
const createAuthenticationStrategy = require('../middleware/createAuthenticationStrategy');

const router = express.Router();
const jwtAuthenticate = createAuthenticationStrategy('jwt');
const localAuthenticate = createAuthenticationStrategy('local');
const googleAuthenticate = createAuthenticationStrategy('google-token');
const facebookAuthenticate = createAuthenticationStrategy('facebook-token');

setting_controller = require('../controllers/SettingController');

router.get('/', function(req, res, next) {
  setting_controller.showEditSetting(req, res);
});

router.post('/update/:settingId', function (req, res) {
  setting_controller.updateSetting(req, res);
});

module.exports = router;
