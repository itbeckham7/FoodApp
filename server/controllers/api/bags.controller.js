const mongoose = require('mongoose');
const createError = require('http-errors');
const Joi = require('@hapi/joi');
const _ = require('lodash');

var foodModel = require('../../models/food.model');
const userModel = require('../../models/user.model');

const updateBagSchema = Joi.object({
  qty: Joi.number().integer(),
});

module.exports = {

  apiGetDetailBags: async function (req, res) {
    if (req.user) {
      var bags = req.body.bags;
console.log('-- bags : ', bags)
      var foodIds = [];
      bags.map((bag) => {
        foodIds.push(bag.foodId);
      });
      console.log('-- foodIds : ', foodIds)
      foodModel
        .find({ _id: { $in: foodIds } })
        .populate({
          path: 'trans',
          model: 'food_trans',
          populate: {
            path: 'languageId',
            model: 'language',
          },
        })
        .exec(function (err, result) {
          if (err) {
            console.log(err);
            throw createError(422, "Can't get bag list");
          }

          var foods = result;
          console.log('-- foods : ', foods)
          bags.map((bag) => {
            var food = foods.filter((f)=>f._id == bag.foodId);
            if( food && food[0] ){
              bag.food = food[0]
            }
          });
          console.log('-- bags : ', bags)
          res.status(200).json({ bags: bags });
          return;
        });
    } else {
      throw createError(401, 'Please Login!');
    }
  },

};
