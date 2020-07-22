const mongoose = require('mongoose');
const createError = require('http-errors');
const Joi = require('@hapi/joi');
const _ = require('lodash');
const constants = require('./constants');

var DiscountModel = require('../models/discount.model');

var BaseController = require('./BaseController');
var View = require('../views/base');

module.exports = BaseController.extend({
    name: 'DiscountController',

    showDiscounts: async function (req, res) {
        let v, discounts;

        if (!this.isLogin(req)) {
            req.session.redirectTo = '/discounts';
            return res.redirect('/auth/login');
        }

        if (req.session.user.role == 'User') {
            return res.redirect('/*');
        }

        discounts = await DiscountModel.find().sort({createdAt: 1});

        v = new View(res, 'discounts/index');
        v.render({
            title: 'Discounts',
            discounts: discounts,
            session: req.session,
            error: req.flash('error'),
            success: req.flash('success')
        });
    },

    showAddDiscount: async function (req, res) {
        let v;
        if (!this.isLogin(req)) {
            req.session.redirectTo = '/discounts/add';
            return res.redirect('/auth/login');
        }
        if (req.session.user.role == 'User') {
            return res.redirect('/*');
        }

        v = new View(res, 'discounts/edit');
        v.render({
            title: 'Discounts',
            pg_mode: 'add',
            session: req.session,
            error: req.flash('error'),
            success: req.flash('success')
        });
    },

    createDiscount: async function (req, res) {
        let discountInfo, prevDiscountInfo;
        if (!this.isLogin(req)) {
            req.session.redirectTo = '/discounts/add';
            return res.redirect('/auth/login');
        }

        if (req.session.user.role == 'User') {
            return res.redirect('/dashboard');
        }
        
        // Check same discount with sku address
        prevDiscountInfo = await DiscountModel.findOne({code: req.body['discount-code']});
        if (prevDiscountInfo) {
            req.flash('error', 'The code is already exist.');
            return res.redirect('/discounts/add');
        }

        discountInfo = {
            title: req.body['discount-title'],
            code: req.body['discount-code'],
            fromDate: new Date(req.body['discount-fromDate']),
            toDate: new Date(req.body['discount-toDate']),
            amount: req.body['discount-amount'],
            type: req.body['discount-type'],
            status: req.body['discount-status'] == 'on' ? true : false ,
        };

        new DiscountModel(discountInfo).save(function (err, result) {
            if (err) {
                console.log(err);
                req.flash('error', 'Database error');
                return res.redirect('/discounts');
            }
            req.flash('success', 'New discount created successfully!');
            return res.redirect('/discounts');
        })
    },
    
    showEditDiscount: async function (req, res) {
        let v, discountInfo, discountId;
        if (!this.isLogin(req)) {
            req.session.redirectTo = '/discounts/edit/' + req.params.discountId;
            return res.redirect('/auth/login');
        }

        if (req.session.user.role == 'User') {
            return res.redirect('/*');
        }

        discountId = req.params.discountId;        
        discountInfo = await DiscountModel.findOne({_id: discountId});
        if (!discountInfo) {
            return res.redirect('/*');
        }

        v = new View(res, 'discounts/edit');
        v.render({
            title: 'Discounts',
            pg_mode: 'edit',
            discount_info: discountInfo,
            session: req.session,
            error: req.flash('error'),
            success: req.flash('success')
        });
    },

    updateDiscount: async function (req, res) {
        let discountId, discountInfo, prevDiscount;
        discountId = req.params.discountId;
        if (!this.isLogin(req)) {
            req.session.redirectTo = '/discounts/edit/' + discountId;
            return res.redirect('/auth/login');
        }

        if (req.session.user.role == 'User') {
            return res.redirect('/dashboard');
        }

        discountInfo = await DiscountModel.findOne({_id: discountId});
        if (!discountInfo) {
            return res.redirect('/discounts');
        }

        prevDiscount = await DiscountModel.findOne({_id: {$ne: discountInfo._id}, code: req.body['discount-code']});
        if (prevDiscount) {
            req.flash('error', 'Code is already exist. Please change Code');
            return res.redirect('/discounts/edit/' + discountId);
        }

        discountInfo.title = req.body['discount-title'],
        discountInfo.code = req.body['discount-code'],
        discountInfo.fromDate = new Date(req.body['discount-fromDate']),
        discountInfo.toDate = new Date(req.body['discount-toDate']),
        discountInfo.amount = req.body['discount-amount'],
        discountInfo.type = req.body['discount-type'],
        discountInfo.status = req.body['discount-status'] == 'on' ? true : false ,
        
        await discountInfo.save();
        req.flash('success', 'Updated successfully');
        return res.redirect('/discounts/edit/' + discountId);
    },

    deleteDiscount: async function (req, res) {
        let discountId, discountInfo;
        discountId = req.params.discountId;
        if (!this.isLogin(req)) {
            req.session.redirectTo = '/discounts';
            return res.redirect('/auth/login');
        }
        if (req.session.user.role == 'User') {
            return res.redirect('/*');
        }

        discountInfo = await DiscountModel.findOne({_id: discountId});
        if (!discountInfo) {
            return res.redirect('/*');
        }
        
        DiscountModel.deleteOne({_id: discountId}, function (err, result) {
            if (err) {
                req.flash('error', 'Database Error');
                console.log(err);
                return res.redirect('/discounts');
            }
            req.flash('success', 'Discount Deleted Successfully!');
            return res.redirect('/discounts');
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

});
