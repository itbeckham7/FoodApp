const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const _ = require('lodash');
const createError = require('http-errors');

const User = mongoose.model('user');
var UserModel = require('../../models/user.model');


module.exports.apiGetAdmins = async (req, res, next) => {
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

    query.role = { $in: ['admin'] };

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
          ret.data = "Can't get admin list";
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

/**
 * @function preloadTargetAdmin
 * Preload the target user object and assign it to res.locals.targetAdmin.
 *
 * @param {string} adminId The target admin ID
 */
module.exports.preloadTargetAdmin = (req, res, next, adminId) => {
  if (!mongoose.Types.ObjectId.isValid(adminId)) {
    return next(createError(422, 'Invalid admin ID'));
  }

  User.findById(adminId)
    .then((targetAdmin) => {
      if (!targetAdmin) {
        throw createError(422, 'Admin ID does not exist');
      }
      res.locals.targetAdmin = targetAdmin;
      next();
    })
    .catch(next);
};

