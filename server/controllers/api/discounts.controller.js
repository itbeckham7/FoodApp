const mongoose = require('mongoose');
const createError = require('http-errors');
const Joi = require('@hapi/joi');
const _ = require('lodash');

var DiscountModel = require('../../models/discount.model');
var LanguageModel = require('../../models/language.model');

module.exports = {
  /**
   * api functions
   */

  apiGetDiscounts: async function (req, res) {
    let ret = { status: 'fail', data: '' };

    if (req.user) {
      order = req.body.order;
      search = req.body.search.value;
      pageNum = parseInt(parseInt(req.body.start) / parseInt(req.body.length));
      pageCount = parseInt(req.body.length);
      orderArr = [
        'title',
        'code',
        'amount',
        'type',
        'fromDate',
        'toDate',
        'status',
      ];
      var query = {
        $or: [
          { title: { $regex: `.*${search}.*`, $options: 'i' } },
          { code: { $regex: `.*${search}.*`, $options: 'i' } },
        ],
      };

      var totalItems = await DiscountModel.find(query).select('_id');
      totalItems = totalItems.length;

      DiscountModel.find(query)
        .limit(pageCount)
        .skip(pageCount * pageNum)
        .sort([
          [orderArr[parseInt(order[0].column)], order[0].dir == 'asc' ? 1 : -1],
        ])
        .exec(function (err, result) {
          if (err) {
            ret.data = "Can't get discount list";
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

  preloadTargetDiscount: (req, res, next, discountId) => {
    if (!mongoose.Types.ObjectId.isValid(discountId)) {
      return next(createError(422, 'Invalid discount ID'));
    }

    DiscountModel.findById(discountId)
      .then((targetDiscount) => {
        if (!targetDiscount) {
          throw createError(422, 'discount ID does not exist');
        }
        res.locals.targetDiscount = targetDiscount;
        next();
      })
      .catch(next);
  },
};
