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

      var foodIds = [];
      bags.map((bag) => {
        if( bag.qty > 0 )
          foodIds.push(bag.foodId);
      });
      
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
          var newBags = [];
          bags.map((bag) => {
            var food = foods.filter((f)=>f._id == bag.foodId);
            if( food && food[0] ){
              bag.food = food[0];
              newBags.push(bag)
            }
          });
          
          res.status(200).json({ bags: newBags });
          return;
        });
    } else {
      throw createError(401, 'Please Login!');
    }
  },

};
