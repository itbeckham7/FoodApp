const mongoose = require('mongoose');
const createError = require('http-errors');
const Joi = require('@hapi/joi');
const _ = require('lodash');

var BranchModel = require('../../models/branch.model');
var LanguageModel = require('../../models/language.model');

module.exports = {
  /**
   * api functions
   */

  apiGetBranches: async function (req, res, next) {
    let ret = { status: 'fail', data: '' };

    if (req.user) {
      BranchModel.find()
        .then((branches) => {
          res.status(200).json({ branches: branches });
        })
        .catch(next);
    } else {
      ret.data = 'Please Login!';
      throw createError(401, 'Please Login!');
    }
  },

  apiGetBranchesDatatable: async function (req, res) {
    let ret = { status: 'fail', data: '' };

    if (req.user) {
      order = req.body.order;
      search = req.body.search.value;
      pageNum = parseInt(parseInt(req.body.start) / parseInt(req.body.length));
      pageCount = parseInt(req.body.length);
      orderArr = ['name', 'code', 'address', 'startTime', 'endTime', 'status'];
      var query = {
        $or: [
          { name: { $regex: `.*${search}.*`, $options: 'i' } },
          { code: { $regex: `.*${search}.*`, $options: 'i' } },
          { address: { $regex: `.*${search}.*`, $options: 'i' } },
        ],
      };

      var totalItems = await BranchModel.find(query).select('_id');
      totalItems = totalItems.length;

      BranchModel.find(query)
        .limit(pageCount)
        .skip(pageCount * pageNum)
        .sort([
          [orderArr[parseInt(order[0].column)], order[0].dir == 'asc' ? 1 : -1],
        ])
        .exec(function (err, result) {
          if (err) {
            ret.data = "Can't get branch list";
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
  },

  preloadTargetBranch: (req, res, next, branchId) => {
    if (!mongoose.Types.ObjectId.isValid(branchId)) {
      return next(createError(422, 'Invalid branch ID'));
    }

    BranchModel.findById(branchId)
      .then((targetBranch) => {
        if (!targetBranch) {
          throw createError(422, 'branch ID does not exist');
        }
        res.locals.targetBranch = targetBranch;
        next();
      })
      .catch(next);
  },
};
