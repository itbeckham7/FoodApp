const mongoose = require('mongoose');
const createError = require('http-errors');
const Joi = require('@hapi/joi');
const _ = require('lodash');

var CommentModel = require('../../models/comment.model');
var FoodModel = require('../../models/food.model');
const userModel = require('../../models/user.model');

const addCommentSchema = Joi.object({
  subject: Joi.string().trim(),
  description: Joi.string().trim(),
  rating: Joi.number().integer().default(0),
});

module.exports = {
  apiGetComments: async function (req, res, next) {
    if (req.user) {
      CommentModel.find({ foodId: req.params.foodId })
        .populate('userId')
        .exec(async function (err, result) {
          if (err) {
            console.log(err);
            throw createError(422, "Can't get comment list");
            return;
          }

          var totalRating = 0;
          var comments = result;
          if (comments && comments.length > 0) {
            comments.map((comment) => {
              totalRating += comment.rating;
            });
            totalRating = parseFloat(totalRating / comments.length).toFixed(1);
          }

          var food = await FoodModel.findOne({ _id: req.params.foodId });
          if( food ){
            food.rating = totalRating
          }
          await food.save();
          res.status(200).json({ comments: result });
        });
    } else {
      throw createError(401, 'Please Login!');
    }
  },

  apiGetComment: async function (req, res, next) {
    var commentId = req.params.commentId;

    if (req.user) {
      CommentModel.findOne({ _id: commentId })
        .populate('userId')
        .exec(function (err, result) {
          if (err) {
            console.log(err);
            throw createError(422, "Can't get comment");
            return;
          }
          res.status(200).json({ comment: result });
        });
    } else {
      throw createError(401, 'Please Login!');
    }
  },

  apiAddComment: (req, res, next) => {
    let newComment;

    addCommentSchema
      .validateAsync(req.body, { stripUnknown: true })
      .then((payload) => {
        req.body = payload;

        newComment = new CommentModel(req.body);
        newComment.userId = req.params.userId;
        newComment.foodId = req.params.foodId;

        return newComment.save();
      })
      .then((comment) => {
        CommentModel.find({ foodId: req.params.foodId })
          .populate('userId')
          .exec(async function (err, result) {
            if (err) {
              console.log(err);
              throw createError(422, "Can't get comment list");
              return;
            }

            var totalRating = 0;
            var comments = result
            if (comments && comments.length > 0) {
              comments.map((comment) => {
                totalRating += comment.rating;
              });
              totalRating = parseFloat(totalRating / comments.length).toFixed(1);
            }

            var food = await FoodModel.findOne({ _id: req.params.foodId });
            if( food ){
              food.rating = totalRating
            }
            await food.save();
            res.status(200).json({ comments: comments });
          });
      })
      .catch(next);
  },

  preloadTargetComment: (req, res, next, commentId) => {
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return next(createError(422, 'Invalid comment ID'));
    }

    CommentModel.findById(commentId)
      .then((targetComment) => {
        if (!targetComment) {
          throw createError(422, 'comment ID does not exist');
        }
        res.locals.targetComment = targetComment;
        next();
      })
      .catch(next);
  },
};
