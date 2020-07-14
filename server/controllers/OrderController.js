const mongoose = require('mongoose');
const createError = require('http-errors');
const Joi = require('@hapi/joi');
const _ = require('lodash');
const constants = require('./constants');

var OrderModel = require('../models/order.model');
var OrderClientModel = require('../models/orderClient.model');

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

        if (req.session.user.role == 'User') {
            return res.redirect('/*');
        }

        orders = await OrderModel.find().sort({createdAt: 1});

        v = new View(res, 'orders/index');
        v.render({
            title: 'Orders',
            orders: orders,
            session: req.session,
            error: req.flash('error'),
            success: req.flash('success')
        });
    },

    showAddOrder: async function (req, res) {
        let v;
        if (!this.isLogin(req)) {
            req.session.redirectTo = '/orders/add';
            return res.redirect('/auth/login');
        }
        if (req.session.user.role == 'User') {
            return res.redirect('/*');
        }

        v = new View(res, 'orders/edit');
        v.render({
            title: 'Orders',
            pg_mode: 'add',
            session: req.session,
            error: req.flash('error'),
            success: req.flash('success')
        });
    },

    createOrder: async function (req, res) {
        let orderInfo, prevOrderInfo;
        if (!this.isLogin(req)) {
            req.session.redirectTo = '/orders/add';
            return res.redirect('/auth/login');
        }

        if (req.session.user.role == 'User') {
            return res.redirect('/*');
        }
        
        // Check same order with sku address
        prevOrderInfo = await OrderModel.findOne({sku: req.body.sku});
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
        })
    },
    
    showEditOrder: async function (req, res) {
        let v, orderInfo, orderId;
        if (!this.isLogin(req)) {
            req.session.redirectTo = '/orders/edit/' + req.params.orderId;
            return res.redirect('/auth/login');
        }

        if (req.session.user.role == 'User') {
            return res.redirect('/*');
        }

        orderId = req.params.orderId;        
        orderInfo = await OrderModel.findOne({_id: orderId});
        if (!orderInfo) {
            return res.redirect('/*');
        }

        v = new View(res, 'orders/edit');
        v.render({
            title: 'Orders',
            pg_mode: 'edit',
            order_info: orderInfo,
            session: req.session,
            error: req.flash('error'),
            success: req.flash('success')
        });
    },

    updateOrder: async function (req, res) {
        let orderId, orderInfo, prevOrder;
        orderId = req.params.orderId;
        if (!this.isLogin(req)) {
            req.session.redirectTo = '/orders/edit/' + orderId;
            return res.redirect('/auth/login');
        }

        if (req.session.user.role == 'User') {
            return res.redirect('/*');
        }

        orderInfo = await OrderModel.findOne({_id: orderId});
        if (!orderInfo) {
            return res.redirect('/*');
        }

        prevOrder = await OrderModel.findOne({_id: {$ne: orderInfo._id}, sku: req.body.sku});
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
        if (req.session.user.role == 'User') {
            return res.redirect('/*');
        }

        orderInfo = await OrderModel.findOne({_id: orderId});
        if (!orderInfo) {
            return res.redirect('/*');
        }
        
        OrderModel.deleteOne({_id: orderId}, function (err, result) {
            if (err) {
                req.flash('error', 'Database Error');
                console.log(err);
                return res.redirect('/orders');
            }
            req.flash('success', 'Order Deleted Successfully!');
            return res.redirect('/orders');
        })
    },

    getSkuFromName: async function (name) {
        let nameArr = name.split(' ');
        nameArr = nameArr.map(function(n){
            return n.toUpperCase() + n.slice(1);
        })
        let sku = nameArr.join('_');
        return sku
    },

    /**
     * api functions
     */

    apiGetOrders: async function (req, res) {
        let ret = {status: 'fail', data: ''};

        if (!this.isLogin(req)) {
            ret.data = "Please Login!";
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
                }})
            .exec(function(err, result){
                if (err) {
                    ret.data = "Can't get product list";
                    console.log(err);
                    return res.json(ret);
                }
                ret.data = result;
                ret.status = 'success';
                res.json(ret);
            })
    },
});