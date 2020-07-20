const mongoose = require('mongoose');
const createError = require('http-errors');
const Joi = require('@hapi/joi');
const _ = require('lodash');
const constants = require('../constants');

const User = mongoose.model('user');

/**
 * @function apiGetProfile
 * Get profile controller
 *
 */
module.exports.getProfile = (req, res, next) => {
  if (req.user) {
    res.status(200).send({ profile: req.user.toJsonFor(req.user) });
  }
};

/**
 * JOI schema for validating updateProfile payload
 */
const updateProfileSchema = Joi.object({
  password: Joi.string().min(8).messages(constants.PASSWORD_ERROR_MESSAGES),
  firstName: Joi.string().trim(),
  lastName: Joi.string().trim(),
  username: Joi.string().trim(),
  email: Joi.string().trim(),
  phone: Joi.string().trim(),
  country: Joi.string().trim(),
});

/**
 * @function apiUpdateProfile
 * Get profile controller
 *
 * @param {string} [req.body.password] The password to update
 * @param {string} [req.body.firstName] The first name to update
 * @param {string} [req.body.lastName] The last name to update
 */
module.exports.updateProfile = (req, res, next) => {
  if (req.user) {
    if (_.isEmpty(req.body)) {
      return res.status(200).json({ updatedFields: [] });
    }
    
    updateProfileSchema
      .validateAsync(req.body, { stripUnknown: true })
      .then((payload) => {
        req.body = payload;
        const { password, ...others } = req.body;
        _.merge(req.user, others);
        if (password) {
          req.user.setSubId(); // invalidate all existing JWT tokens
          return req.user.setPasswordAsync(password);
        }
      })
      .then(() => {
        return req.user.save();
      })
      .then((updatedUser) => {
        res.status(200).json({ user: updatedUser.toJsonFor(updatedUser) });
      })
      .catch(next);
  }
};

/**
 * @function apiGetPublicProfile
 * Get public profile controller
 *
 * @param {string} req.params.userId The user ID
 */
module.exports.getPublicProfile = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
    return next(createError(422, 'Invalid user ID'));
  }

  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw createError(422, 'User ID does not exist');
      }
      res.status(200).send({ profile: user.toJsonFor() });
    })
    .catch(next);
};
