const mongoose = require('mongoose');
const createError = require('http-errors');
const Joi = require('@hapi/joi');
const _ = require('lodash');

var OrderModel = require('../../models/order.model');
const UserModel = require('../../models/user.model');
const FoodModel = require('../../models/food.model');

const addOrderSchema = Joi.object({
  userId: Joi.string().trim(),
  firstName: Joi.string().trim(),
  lastName: Joi.string().trim(),
  phone: Joi.string().trim(),
  email: Joi.string().trim(),
  address: Joi.string().trim(),
  cardType: Joi.string().trim(),
  holderName: Joi.string().trim(),
  cardNumber: Joi.string().trim(),
  expireDate: Joi.string().trim(),
  cvv: Joi.string().trim(),
  deliveryStyle: Joi.string().trim(),
  bags: Joi.string().trim(),
  price: Joi.number(),
  currency: Joi.string().trim(),
  branchId: Joi.string().allow(null),
  deliveryTime: Joi.string().allow(''),
  status: Joi.string().trim(),
});

const changeStatusSchema = Joi.object({
  orderId: Joi.string().trim(),
  status: Joi.string().trim(),
});

module.exports = {
  apiGetOrders: async function (req, res, next) {
    if (req.user) {
      OrderModel.find({ userId: req.params.userId })
        .then((orders) => {
          if (!orders) {
            throw createError(422, 'User have no orders');
          }
          res.status(200).json({ orders: orders });
        })
        .catch(next);
    } else {
      throw createError(401, 'Please Login!');
    }
  },

  apiGetOrder: async function (req, res, next) {
    var orderId = req.params.orderId;
    console.log('-- apiGetOrder orderId : ', orderId);
    if (req.user) {
      OrderModel.findOne({ _id: orderId })
        .then(async (order) => {
          console.log('-- apiGetOrder order : ', order);
          if (!order) {
            throw createError(422, "Can't get order");
          }

          var bags = JSON.parse(order.bags);

          var foodIds = [];
          bags.map((bag) => {
            if (bag.qty > 0) foodIds.push(bag.foodId);
          });

          var foods = await FoodModel.find({ _id: { $in: foodIds } }).populate({
            path: 'trans',
            model: 'food_trans',
            populate: {
              path: 'languageId',
              model: 'language',
            },
          });

          var newBags = [];
          bags.map((bag) => {
            var food = foods.filter((f) => f._id == bag.foodId);
            if (food && food[0]) {
              bag.food = food[0];
              newBags.push(bag);
            }
          });

          order = {
            ...order._doc,
            bags: newBags,
          };
          console.log('-- apiGetOrder order1 : ', order);

          res.status(200).json({ order: order });
        })
        .catch(next);
    } else {
      throw createError(401, 'Please Login!');
    }
  },

  apiAddOrder: (req, res, next) => {
    console.log('-- apiAddOrder : start');
    if (req.user) {
      addOrderSchema
        .validateAsync(req.body, { stripUnknown: true })
        .then((payload) => {
          req.body = payload;
          console.log('-- apiAddOrder req.body : ', req.body);
          newOrder = new OrderModel(req.body);
          newOrder.orderId = '#' + new Date().getTime();
          newOrder.track = JSON.stringify({
            trackId: newOrder.orderId,
            history: [
              {
                time: new Date(),
                status: 'pending',
                title: 'Pending Order',
                address: newOrder.address,
              },
              {
                time: null,
                status: 'confirm',
                title: 'Confirm Order',
                address: null,
              },
              {
                time: null,
                status: 'processing',
                title: 'Processing Order',
                address: null,
              },
              {
                time: null,
                status: 'delivery',
                title: 'Delivery Order',
                address: null,
              },
              {
                time: null,
                status: 'readyreceipt',
                title: 'Ready Receipt',
                address: null,
              },
              {
                time: null,
                status: 'delivered',
                title: 'Delivered',
                address: null,
              },
            ],
          });

          return newOrder.save();
        })
        .then((order) => {
          if (!order) {
            throw createError(422, "Can't add order");
          }
          return res.status(200).json({ order: order });
        })
        .catch(next);
    } else {
      throw createError(401, 'Please Login!');
    }
  },

  apiChangeOrderStatus: (req, res, next) => {
    let ret = { status: 'fail', data: '' };
    if (req.user) {
      changeStatusSchema
        .validateAsync(req.body, { stripUnknown: true })
        .then((payload) => {
          req.body = payload;
          console.log('-- apiChangeOrderStatus req.body : ', req.body);
          return OrderModel.findOne({ _id: req.body.orderId });
        })
        .then((order) => {
          console.log('-- apiChangeOrderStatus order 1 : ', order);
          var trackInfo = JSON.parse(order.track);
          var tracks = trackInfo.history;
          for (var i = 0; i < tracks.length; i++) {
            if (tracks[i].status == req.body.status) newTrackIdx = i
            if (tracks[i].status == order.status) curTrackIdx = i
            // {
            //   if (i == 0) break;
            //   if (tracks[i - 1].time != null) break;
            //   ret.data = 'Can\'t change to this status.';
            //   res.status(200).send(ret);
            //   return;
            // }
          }
console.log('-- track idx : ', newTrackIdx, curTrackIdx)
          if( newTrackIdx < curTrackIdx || newTrackIdx-curTrackIdx > 1 ){
            return;
          }

          tracks[newTrackIdx].time = new Date();
          tracks[newTrackIdx].address = order.address;
          trackInfo.history = tracks;
          order.status = req.body.status;
          order.track = JSON.stringify(trackInfo)
          return order.save();

        })
        .then((order) => {
          if( order ){
            console.log('-- apiChangeOrderStatus order 2 : ', order);
            ret.data = order;
            ret.status = 'success';
            res.status(200).send(ret);
          } else {
            ret.data = 'Can\'t change to this status.';
            res.status(200).send(ret);
          }
        })
        .catch(next);
    } else {
      ret.data = 'Please Login!';
      res.status(200).send(ret);
    }
  },

  apiGetOrdersDatatable: async function (req, res) {
    let ret = { status: 'fail', data: '' };

    if (req.user) {
      order = req.body.order;
      search = req.body.search.value;
      pageNum = parseInt(parseInt(req.body.start) / parseInt(req.body.length));
      pageCount = parseInt(req.body.length);
      orderArr = ['orderId', 'cardType', 'status', 'createdAt'];
      var query = {
        $or: [
          { orderId: { $regex: `.*${search}.*`, $options: 'i' } },
          { cardType: { $regex: `.*${search}.*`, $options: 'i' } },
          { status: { $regex: `.*${search}.*`, $options: 'i' } },
        ],
      };
      console.log('-- req.body : ', req.body);
      console.log('-- query : ', query);
      var totalItems = await OrderModel.find(query).select('_id');
      totalItems = totalItems.length;

      OrderModel.find(query)
        .limit(pageCount)
        .skip(pageCount * pageNum)
        .sort([
          [orderArr[parseInt(order[0].column)], order[0].dir == 'asc' ? 1 : -1],
        ])
        .exec(async function (err, result) {
          console.log('-- result : ', result);
          if (err) {
            ret.data = "Can't get discount list";
            console.log(err);
            res.status(200).send(ret);
            return;
          }

          var orders = result;
          var newOrders = [];
          for (var i = 0; i < orders.length; i++) {
            var bags = JSON.parse(orders[i].bags);

            var foodIds = [];
            bags.map((bag) => {
              if (bag.qty > 0) foodIds.push(bag.foodId);
            });

            var foods = await FoodModel.find({
              _id: { $in: foodIds },
            }).populate({
              path: 'trans',
              model: 'food_trans',
              populate: {
                path: 'languageId',
                model: 'language',
              },
            });

            var newBags = [];
            bags.map((bag) => {
              var food = foods.filter((f) => f._id == bag.foodId);
              if (food && food[0]) {
                bag.food = food[0];
                newBags.push(bag);
              }
            });

            console.log('-- newBags : ', newBags);
            newOrders.push({
              ...orders[i]._doc,
              bags: newBags,
            });
          }

          console.log('-- newOrders : ', newOrders);

          ret.data = {
            draw: 1,
            recordsTotal: totalItems,
            recordsFiltered: totalItems,
            data: newOrders,
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

  preloadTargetOrder: (req, res, next, orderId) => {
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return next(createError(422, 'Invalid order ID'));
    }

    OrderModel.findById(orderId)
      .then((targetOrder) => {
        if (!targetOrder) {
          throw createError(422, 'order ID does not exist');
        }
        res.locals.targetOrder = targetOrder;
        next();
      })
      .catch(next);
  },
};
