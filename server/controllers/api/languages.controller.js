const mongoose = require('mongoose');
const createError = require('http-errors');
const Joi = require('@hapi/joi');
const _ = require('lodash');

var languageModel = require('../../models/language.model');

module.exports = {

  apiGetLanguages: async function (req, res) {
    languageModel.find()
    .then((langs)=>{
      if( langs && langs.length > 0 ){
        res.status(200).json({ langs: langs });
        return;
      } else {
        throw createError(401, 'languages not valid');
      }
    })
  },

};
