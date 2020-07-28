const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const _ = require('lodash');
const createError = require('http-errors');

const User = mongoose.model('user');
var UserModel = require('../../models/user.model');

/**
 * Joi schema for validating getUser query
 */
const getUsersSchema = Joi.object({
  sort: Joi.string()
    .trim()
    .pattern(/^(-?[A-Za-z]+)( -?[A-Za-z]+)*$/), // matches "-descFieldName ascFieldName"
  limit: Joi.number().integer().default(30),
  skip: Joi.number().integer().default(0),
  username: Joi.string().trim(),
  email: Joi.string().email(),
  firstName: Joi.string().trim(),
  lastName: Joi.string().trim(),
  status: Joi.string().valid('active', 'disabled', 'unverified-email'),
  role: Joi.string().valid('root', 'admin', 'user'),
  permissions: Joi.string().trim(),
});

/**
 * @function getUsers
 * Get users controller
 *
 * @param {string} [req.query.sort] The sort order string. It must be a space
 * delimited list of path names. The sort order of each path is ascending
 * unless the path name is prefixed with "-" which will be treated as descending.
 * @param {number} [req.query.limit] The limit number (default: 30)
 * @param {number} [req.query.skip] The skip number (default: 0)
 * @param {string} [req.query.username] The username
 * @param {string} [req.query.email] The email
 * @param {string} [req.query.firstName] The first name
 * @param {string} [req.query.lastName] The last name
 * @param {string} [req.query.status] The user status
 * @param {string} [req.query.role] The user role
 * @param {string} [req.query.permissions] The user permissions
 */
module.exports.getUsers = (req, res, next) => {
  getUsersSchema
    .validateAsync(req.query)
    .then((payload) => {
      req.query = payload;
      const query = _.pick(req.query, [
        'username',
        'email',
        'firstName',
        'lastName',
        'status',
        'role',
      ]);
      if (req.query.permissions) {
        // Include root and admin
        query.$or = [
          {
            [`permissions.${req.query.permissions}`]: true,
          },
          { role: { $in: ['root', 'admin'] } },
        ];
      }
      return Promise.all([
        User.find(query)
          .sort(req.query.sort)
          .limit(req.query.limit)
          .skip(req.query.skip)
          .exec(),
        User.countDocuments(query),
      ]);
    })
    .then(([users, usersCount]) => {
      res.status(200).json({
        users: users.map((user) => user.toJsonFor(req.user)),
        usersCount,
      });
    })
    .catch(next);
};

/**
 * @function preloadTargetUser
 * Preload the target user object and assign it to res.locals.targetUser.
 *
 * @param {string} userId The target user ID
 */
module.exports.preloadTargetUser = (req, res, next, userId) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return next(createError(422, 'Invalid user ID'));
  }

  User.findById(userId)
    .then((targetUser) => {
      if (!targetUser) {
        throw createError(422, 'User ID does not exist');
      }
      res.locals.targetUser = targetUser;
      next();
    })
    .catch(next);
};

/**
 * @function getUser
 * Get the target user
 */
module.exports.getUser = (req, res, next) => {
  res.status(200).json({ user: res.locals.targetUser.toJsonFor(req.user) });
};

/**
 * @function deletedUser
 * Delete the target user
 */
module.exports.deleteUser = (req, res, next) => {
  res.locals.targetUser
    .delete()
    .then((deletedUser) => {
      res.status(200).json({ message: 'User deleted' });
    })
    .catch(next);
};

/**
 * Joi schema for validating updateUser payload
 */
const updateUserSchema = Joi.object({
  role: Joi.string().valid('root', 'admin', 'user'),
  status: Joi.string().valid('active', 'disabled', 'unverified-email'),
  permissions: Joi.object(),
});

/**
 * @function updatedUser
 * Update user controller.
 *
 * @param {string} [req.body.role] The role could be 'root', 'admin' or 'user'. Only root are allowed to update role.
 * @param {status} [req.body.status] The status of user
 * @param {object} [req.body.permissions] The permissions object
 */
module.exports.updateUser = (req, res, next) => {
  updateUserSchema
    .validateAsync(req.body, { stripUnknown: true })
    .then((payload) => {
      req.body = payload;
      if (req.body.role) {
        if (
          (req.user.role === 'admin' && req.body.role !== 'user') ||
          (req.user.role === 'user' && req.body.role !== 'user')
        ) {
          throw createError(403, 'Forbidden action');
        }
      }
      _.merge(res.locals.targetUser, req.body);
      return res.locals.targetUser.save();
    })
    .then((updatedUser) => {
      res.status(200).json({ updatedFields: _.keys(req.body) });
    })
    .catch(next);
};

module.exports.apiGetUsers = async (req, res, next) => {
  let ret = { status: 'fail', data: '' };

  if (req.user) {
    order = req.body.order;
    search = req.body.search.value;
    pageNum = parseInt(parseInt(req.body.start) / parseInt(req.body.length));
    pageCount = parseInt(req.body.length);
    orderArr = [
      'email',
      'userName',
      'phone',
      'role',
      'emailActive',
      'ipAddress',
      'loginCount',
      'status',
    ];
    var query = {
      $or: [
        { email: { $regex: `.*${search}.*`, $options: 'i' } },
        { userName: { $regex: `.*${search}.*`, $options: 'i' } },
        { phone: { $regex: `.*${search}.*`, $options: 'i' } },
        { ipAddress: { $regex: `.*${search}.*`, $options: 'i' } },
        { role: { $regex: `.*${search}.*`, $options: 'i' } },
      ],
    };

    query.role = { $in: ['user'] };

    var totalItems = await UserModel.find(query).select('_id');
    totalItems = totalItems.length;

    UserModel.find(query)
      .limit(pageCount)
      .skip(pageCount * pageNum)
      .sort([
        [orderArr[parseInt(order[0].column)], order[0].dir == 'asc' ? 1 : -1],
      ])
      .exec(function (err, result) {
        if (err) {
          ret.data = "Can't get user list";
          console.log(err);
          res.status(200).send(ret);
          return;
        }
        
        ret.data = {
          draw: 1,
          recordsTotal: totalItems,
          recordsFiltered: totalItems,
          data: result,
        };
        ret.status = 'success';

        res.status(200).send(ret);
        return;
      });
  } else {
    ret.data = 'Please Login!';
    res.status(200).send(ret);
    return;
  }
};
