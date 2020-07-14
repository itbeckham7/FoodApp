const mongoose = require('mongoose');
const createError = require('http-errors');
const Joi = require('@hapi/joi');
const _ = require('lodash');
const constants = require('./constants');

var TransactionModel = require('../models/transaction.model');
var OrderModel = require('../models/order.model');

var BaseController = require('./BaseController');
var View = require('../views/base');

module.exports = BaseController.extend({
    name: 'TransactionController',

    showTransactions: async function (req, res) {
        let v, transactions;

        if (!this.isLogin(req)) {
            req.session.redirectTo = '/transactions';
            return res.redirect('/auth/login');
        }

        if (req.session.user.role == 'User') {
            return res.redirect('/*');
        }

        transactions = await TransactionModel.find().sort({createdAt: 1});

        v = new View(res, 'transactions/index');
        v.render({
            title: 'Transactions',
            transactions: transactions,
            session: req.session,
            error: req.flash('error'),
            success: req.flash('success')
        });
    },

    showAddTransaction: async function (req, res) {
        let v;
        if (!this.isLogin(req)) {
            req.session.redirectTo = '/transactions/add';
            return res.redirect('/auth/login');
        }
        if (req.session.user.role == 'User') {
            return res.redirect('/*');
        }

        v = new View(res, 'transactions/edit');
        v.render({
            title: 'Transactions',
            pg_mode: 'add',
            session: req.session,
            error: req.flash('error'),
            success: req.flash('success')
        });
    },

    createTransaction: async function (req, res) {
        let transactionInfo, prevTransactionInfo;
        if (!this.isLogin(req)) {
            req.session.redirectTo = '/transactions/add';
            return res.redirect('/auth/login');
        }

        if (req.session.user.role == 'User') {
            return res.redirect('/*');
        }
        
        // Check same transaction with sku address
        prevTransactionInfo = await TransactionModel.findOne({sku: req.body.sku});
        if (prevTransactionInfo) {
            req.flash('error', 'The SKU is already exist.');
            return res.redirect('/transactions/add');
        }

        transactionInfo = req.body;
        transactionInfo.createdAt = new Date();

        new TransactionModel(transactionInfo).save(function (err, result) {
            if (err) {
                console.log(err);
                req.flash('error', 'Database error');
                return res.redirect('/transactions');
            }
            req.flash('success', 'New user created successfully!');
            return res.redirect('/transactions');
        })
    },
    
    showEditTransaction: async function (req, res) {
        let v, transactionInfo, transactionId;
        if (!this.isLogin(req)) {
            req.session.redirectTo = '/transactions/edit/' + req.params.transactionId;
            return res.redirect('/auth/login');
        }

        if (req.session.user.role == 'User') {
            return res.redirect('/*');
        }

        transactionId = req.params.transactionId;        
        transactionInfo = await TransactionModel.findOne({_id: transactionId});
        if (!transactionInfo) {
            return res.redirect('/*');
        }

        v = new View(res, 'transactions/edit');
        v.render({
            title: 'Transactions',
            pg_mode: 'edit',
            transaction_info: transactionInfo,
            session: req.session,
            error: req.flash('error'),
            success: req.flash('success')
        });
    },

    updateTransaction: async function (req, res) {
        let transactionId, transactionInfo, prevTransaction;
        transactionId = req.params.transactionId;
        if (!this.isLogin(req)) {
            req.session.redirectTo = '/transactions/edit/' + transactionId;
            return res.redirect('/auth/login');
        }

        if (req.session.user.role == 'User') {
            return res.redirect('/*');
        }

        transactionInfo = await TransactionModel.findOne({_id: transactionId});
        if (!transactionInfo) {
            return res.redirect('/*');
        }

        prevTransaction = await TransactionModel.findOne({_id: {$ne: transactionInfo._id}, sku: req.body.sku});
        if (prevTransaction) {
            req.flash('error', 'SKU is already exist. Please change SKU');
            return res.redirect('/transactions/edit/' + transactionId);
        }
        transactionInfo = Object.assign(transactionInfo, req.body);

        await transactionInfo.save();
        req.flash('success', 'Updated successfully');
        return res.redirect('/transactions/edit/' + transactionId);
    },

    deleteTransaction: async function (req, res) {
        let transactionId, transactionInfo;
        transactionId = req.params.transactionId;
        if (!this.isLogin(req)) {
            req.session.redirectTo = '/transactions';
            return res.redirect('/auth/login');
        }
        if (req.session.user.role == 'User') {
            return res.redirect('/*');
        }

        transactionInfo = await TransactionModel.findOne({_id: transactionId});
        if (!transactionInfo) {
            return res.redirect('/*');
        }
        
        TransactionModel.deleteOne({_id: transactionId}, function (err, result) {
            if (err) {
                req.flash('error', 'Database Error');
                console.log(err);
                return res.redirect('/transactions');
            }
            req.flash('success', 'Transaction Deleted Successfully!');
            return res.redirect('/transactions');
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

    apiGetTransactions: async function (req, res) {
        let ret = {status: 'fail', data: ''};

        if (!this.isLogin(req)) {
            ret.data = "Please Login!";
            return res.json(ret);
        }

        TransactionModel.find()
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