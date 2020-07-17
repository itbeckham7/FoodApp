const mongoose = require('mongoose');
const createError = require('http-errors');
const Joi = require('@hapi/joi');
const _ = require('lodash');

var SettingModel = require('../../models/setting.model');
var LanguageModel = require('../../models/language.model');

module.exports = {
  /**
   * api functions
   */

  apiGetSetting: async function (req, res) {
    let ret = { status: 'fail', data: '' };

    var settings = await SettingModel.find();
    if (settings.length > 0) {
      res.status(200).json({ setting: settings[0] });
      return;
    } else {
      throw createError(422, "Can't get setting");
    }
  },

  preloadTargetSetting: (req, res, next, settingId) => {
    if (!mongoose.Types.ObjectId.isValid(settingId)) {
      return next(createError(422, 'Invalid setting ID'));
    }

    SettingModel.findById(settingId)
      .then((targetSetting) => {
        if (!targetSetting) {
          throw createError(422, 'setting ID does not exist');
        }
        res.locals.targetSetting = targetSetting;
        next();
      })
      .catch(next);
  },
};
