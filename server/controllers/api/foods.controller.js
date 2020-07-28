const mongoose = require('mongoose');
const createError = require('http-errors');
const Joi = require('@hapi/joi');
const _ = require('lodash');

var FoodModel = require('../../models/food.model');
var FoodTransModel = require('../../models/foodTrans.model');
var LanguageModel = require('../../models/language.model');

module.exports = {

  apiGetFoods: async function (req, res) {
    let ret = { status: 'fail', data: '' };

    if (req.user) {
      FoodModel.find()
        .populate({
          path: 'trans',
          model: 'food_trans',
          populate: {
            path: 'languageId',
            model: 'language',
          },
        })
        .populate({
          path: 'categoryId',
          model: 'category',
          populate: {
            path: 'trans',
            model: 'category_trans',
          },
        })
        .exec(function (err, result) {
          if (err) {
            ret.data = "Can't get food list";
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


  apiGetSliderFoods: async function (req, res) {
    let ret = { status: 'fail', data: '' };

    if (req.user) {
      FoodModel.find({inSlider: true})
        .populate({
          path: 'trans',
          model: 'food_trans',
          populate: {
            path: 'languageId',
            model: 'language',
          },
        })
        .populate({
          path: 'categoryId',
          model: 'category',
          populate: {
            path: 'trans',
            model: 'category_trans',
          },
        })
        .exec(function (err, result) {
          if (err) {
            ret.data = "Can't get food list";
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


  apiGetFood: async function (req, res) {
    let ret = { status: 'fail', data: '' };
    var foodId = req.params.foodId;

    if (req.user) {
      FoodModel.findOne({'_id': foodId})
        .populate({
          path: 'trans',
          model: 'food_trans',
          populate: {
            path: 'languageId',
            model: 'language',
          },
        })
        .populate({
          path: 'categoryId',
          model: 'category',
          populate: {
            path: 'trans',
            model: 'category_trans',
          },
        })
        .exec(function (err, result) {
          if (err) {
            ret.data = "Can't get food list";
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


  apiGetFoodsFromCategory: async function (req, res) {
    let ret = { status: 'fail', data: '' };
    var categoryId = req.params.categoryId

    if (req.user) {
      FoodModel.find({categoryId: categoryId})
        .populate({
          path: 'trans',
          model: 'food_trans',
          populate: {
            path: 'languageId',
            model: 'language',
          },
        })
        .populate({
          path: 'categoryId',
          model: 'category',
          populate: {
            path: 'trans',
            model: 'category_trans',
          },
        })
        .exec(function (err, result) {
          if (err) {
            ret.data = "Can't get food list";
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

  preloadTargetFood: (req, res, next, foodId) => {
    if (!mongoose.Types.ObjectId.isValid(foodId)) {
      return next(createError(422, 'Invalid food ID'));
    }

    FoodModel.findById(foodId)
      .then((targetFood) => {
        if (!targetFood) {
          throw createError(422, 'food ID does not exist');
        }
        res.locals.targetFood = targetFood;
        next();
      })
      .catch(next);
  },
};
