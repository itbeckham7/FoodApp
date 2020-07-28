const mongoose = require('mongoose');
const createError = require('http-errors');
const Joi = require('@hapi/joi');
const _ = require('lodash');
const constants = require('./constants');

var OrderModel = require('../models/order.model');
var OrderClientModel = require('../models/orderClient.model');
var FoodModel = require('../models/food.model');

var BaseController = require('./BaseController');
var View = require('../views/base');

module.exports = BaseController.extend({
  name: 'OrderController',

  showOrders: async function (req, res) {
    let v, orders;

    if (!this.isLogin(req)) {
      req.session.redirectTo = '/orders';
      return res.redirect('/auth/login');
    }

    if (req.session.user.role != 'root' && !req.session.user.permissions.orderRead) {
      return res.redirect('/dashboard');
    }

    orders = await OrderModel.find().sort({ createdAt: 1 });

    v = new View(res, 'orders/index');
    v.render({
      title: 'Orders',
      orders: orders,
      session: req.session,
      error: req.flash('error'),
      success: req.flash('success'),
    });
  },

  showAddOrder: async function (req, res) {
    let v;
    if (!this.isLogin(req)) {
      req.session.redirectTo = '/orders/add';
      return res.redirect('/auth/login');
    }
    if (req.session.user.role != 'root' && !req.session.user.permissions.orderInsert) {
      return res.redirect('/dashboard');
    }

    v = new View(res, 'orders/edit');
    v.render({
      title: 'Orders',
      pg_mode: 'add',
      session: req.session,
      error: req.flash('error'),
      success: req.flash('success'),
    });
  },

  createOrder: async function (req, res) {
    let orderInfo, prevOrderInfo;
    if (!this.isLogin(req)) {
      req.session.redirectTo = '/orders/add';
      return res.redirect('/auth/login');
    }

    if (req.session.user.role != 'root' && !req.session.user.permissions.orderInsert) {
      return res.redirect('/dashboard');
    }

    // Check same order with sku address
    prevOrderInfo = await OrderModel.findOne({ sku: req.body.sku });
    if (prevOrderInfo) {
      req.flash('error', 'The SKU is already exist.');
      return res.redirect('/orders/add');
    }

    orderInfo = req.body;
    orderInfo.createdAt = new Date();

    new OrderModel(orderInfo).save(function (err, result) {
      if (err) {
        console.log(err);
        req.flash('error', 'Database error');
        return res.redirect('/orders');
      }
      req.flash('success', 'New user created successfully!');
      return res.redirect('/orders');
    });
  },

  showDetailOrder: async function (req, res) {
    let v, orderInfo, orderId;
    if (!this.isLogin(req)) {
      req.session.redirectTo = '/orders/detail/' + req.params.orderId;
      return res.redirect('/auth/login');
    }

    if (req.session.user.role != 'root' && !req.session.user.permissions.orderRead) {
      return res.redirect('/dashboard');
    }

    orderId = req.params.orderId;
    orderInfo = await OrderModel.findOne({ _id: orderId });
    if (!orderInfo) {
      return res.redirect('/dashboard');
    }

    var bags = JSON.parse(orderInfo.bags);

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
		
		orderInfo = {
			...orderInfo._doc,
			bags: newBags
		}

    v = new View(res, 'orders/detail');
    v.render({
      title: 'Orders',
      pg_mode: 'edit',
      orderInfo: orderInfo,
      session: req.session,
      error: req.flash('error'),
      success: req.flash('success'),
    });
  },

  updateOrder: async function (req, res) {
    let orderId, orderInfo, prevOrder;
    orderId = req.params.orderId;
    if (!this.isLogin(req)) {
      req.session.redirectTo = '/orders/edit/' + orderId;
      return res.redirect('/auth/login');
    }

    if (req.session.user.role != 'root' && !req.session.user.permissions.orderUpdate) {
      return res.redirect('/dashboard');
    }

    orderInfo = await OrderModel.findOne({ _id: orderId });
    if (!orderInfo) {
      return res.redirect('/dashboard');
    }

    prevOrder = await OrderModel.findOne({
      _id: { $ne: orderInfo._id },
      sku: req.body.sku,
    });
    if (prevOrder) {
      req.flash('error', 'SKU is already exist. Please change SKU');
      return res.redirect('/orders/edit/' + orderId);
    }
    orderInfo = Object.assign(orderInfo, req.body);

    await orderInfo.save();
    req.flash('success', 'Updated successfully');
    return res.redirect('/orders/edit/' + orderId);
  },

  deleteOrder: async function (req, res) {
    let orderId, orderInfo;
    orderId = req.params.orderId;
    if (!this.isLogin(req)) {
      req.session.redirectTo = '/orders';
      return res.redirect('/auth/login');
    }
    if (req.session.user.role != 'root' && !req.session.user.permissions.orderDelete) {
      return res.redirect('/dashboard');
    }

    orderInfo = await OrderModel.findOne({ _id: orderId });
    if (!orderInfo) {
      return res.redirect('/dashboard');
    }

    OrderModel.deleteOne({ _id: orderId }, function (err, result) {
      if (err) {
        req.flash('error', 'Database Error');
        console.log(err);
        return res.redirect('/orders');
      }
      req.flash('success', 'Order Deleted Successfully!');
      return res.redirect('/orders');
    });
  },

  getSkuFromName: async function (name) {
    let nameArr = name.split(' ');
    nameArr = nameArr.map(function (n) {
      return n.toUpperCase() + n.slice(1);
    });
    let sku = nameArr.join('_');
    return sku;
  },

  /**
   * api functions
   */

  apiGetOrders: async function (req, res) {
    let ret = { status: 'fail', data: '' };

    if (!this.isLogin(req)) {
      ret.data = 'Please Login!';
      return res.json(ret);
    }

    OrderModel.find()
      .populate('trans')
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
          ret.data = "Can't get product list";
          console.log(err);
          return res.json(ret);
        }
        ret.data = result;
        ret.status = 'success';
        res.json(ret);
      });
  },
});
