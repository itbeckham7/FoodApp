const mongoose = require('mongoose');
const createError = require('http-errors');
const Joi = require('@hapi/joi');
const _ = require('lodash');

var CategoryModel = require('../../models/category.model');
var CategoryTransModel = require('../../models/categoryTrans.model');
var LanguageModel = require('../../models/language.model');

module.exports = {

  apiGetCategories: async function (req, res) {
    let ret = { status: 'fail', data: '' };

    if (req.user) {
		CategoryModel.find()
		.populate('trans')
		.populate({
		  path: 'parentId',
		  model: 'category',
		  populate: {
			path: 'trans',
			model: 'category_trans',
		  },
		})
		.exec(function (err, result) {
		  if (err) {
			ret.data = "Can't get catalog list";
			console.log(err);
			res.status(200).send(ret);
			return;
		  }
		  ret.data = result;
		  ret.status = 'success';
		  res.status(200).send(ret);
		  return;
		});
	} else {
      ret.data = 'Please Login!';
	  res.status(200).send(ret);
	  return;
    }
  },

  preloadTargetCategory: (req, res, next, categoryId) => {
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return next(createError(422, 'Invalid category ID'));
    }

    CategoryModel.findById(categoryId)
      .then((targetCategory) => {
        if (!targetCategory) {
          throw createError(422, 'Category ID does not exist');
        }
        res.locals.targetCategory = targetCategory;
        next();
      })
      .catch(next);
  },
};
