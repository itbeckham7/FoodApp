const mongoose = require('mongoose');
const createError = require('http-errors');
const Joi = require('@hapi/joi');
const _ = require('lodash');
const constants = require('./constants');

var BranchModel = require('../models/branch.model');

var BaseController = require('./BaseController');
var View = require('../views/base');

module.exports = BaseController.extend({
    name: 'BranchController',

    showBranches: async function (req, res) {
        let v, branches;

        if (!this.isLogin(req)) {
            req.session.redirectTo = '/branches';
            return res.redirect('/auth/login');
        }

        if (req.session.user.role == 'user') {
            return res.redirect('/dashboard');
        }

        branches = await BranchModel.find().sort({createdAt: 1});

        v = new View(res, 'branches/index');
        v.render({
            title: 'Branches',
            branches: branches,
            session: req.session,
            error: req.flash('error'),
            success: req.flash('success')
        });
    },

    showAddBranch: async function (req, res) {
        let v;
        if (!this.isLogin(req)) {
            req.session.redirectTo = '/branches/add';
            return res.redirect('/auth/login');
        }
        
        if (req.session.user.role != 'root' && !req.session.user.permissions.branchInsert) {
            return res.redirect('/dashboard');
        }

        v = new View(res, 'branches/edit');
        v.render({
            title: 'Branches',
            pg_mode: 'add',
            session: req.session,
            error: req.flash('error'),
            success: req.flash('success')
        });
    },

    createBranch: async function (req, res) {
        let branchInfo, prevBranchInfo;
        if (!this.isLogin(req)) {
            req.session.redirectTo = '/branches/add';
            return res.redirect('/auth/login');
        }

        if (req.session.user.role != 'root' && !req.session.user.permissions.branchInsert) {
            return res.redirect('/dashboard');
        }
        
        // Check same branch with sku address
        prevBranchInfo = await BranchModel.findOne({code: req.body['branch-code']});
        if (prevBranchInfo) {
            req.flash('error', 'The code is already exist.');
            return res.redirect('/branches/add');
        }

        branchInfo = {
            name: req.body['branch-name'],
            code: req.body['branch-code'],
            address: req.body['branch-address'],
            startTime: req.body['branch-startTime'],
            endTime: req.body['branch-endTime'],
            status: req.body['branch-status'] == 'on' ? true : false ,
        };

        new BranchModel(branchInfo).save(function (err, result) {
            if (err) {
                console.log(err);
                req.flash('error', 'Database error');
                return res.redirect('/branches');
            }
            req.flash('success', 'New branch created successfully!');
            return res.redirect('/branches');
        })
    },
    
    showEditBranch: async function (req, res) {
        let v, branchInfo, branchId;
        if (!this.isLogin(req)) {
            req.session.redirectTo = '/branches/edit/' + req.params.branchId;
            return res.redirect('/auth/login');
        }

        if (req.session.user.role != 'root' && !req.session.user.permissions.branchUpdate) {
            return res.redirect('/dashboard');
        }

        branchId = req.params.branchId;        
        branchInfo = await BranchModel.findOne({_id: branchId});
        if (!branchInfo) {
            return res.redirect('/dashboard');
        }

        v = new View(res, 'branches/edit');
        v.render({
            title: 'Branches',
            pg_mode: 'edit',
            branch_info: branchInfo,
            session: req.session,
            error: req.flash('error'),
            success: req.flash('success')
        });
    },

    updateBranch: async function (req, res) {
        let branchId, branchInfo, prevBranch;
        branchId = req.params.branchId;
        if (!this.isLogin(req)) {
            req.session.redirectTo = '/branches/edit/' + branchId;
            return res.redirect('/auth/login');
        }

        if (req.session.user.role != 'root' && !req.session.user.permissions.branchUpdate) {
            return res.redirect('/dashboard');
        }

        branchInfo = await BranchModel.findOne({_id: branchId});
        if (!branchInfo) {
            return res.redirect('/branches');
        }

        prevBranch = await BranchModel.findOne({_id: {$ne: branchInfo._id}, code: req.body['branch-code']});
        if (prevBranch) {
            req.flash('error', 'Code is already exist. Please change Code');
            return res.redirect('/branches/edit/' + branchId);
        }

        branchInfo.name = req.body['branch-name'],
        branchInfo.code = req.body['branch-code'],
        branchInfo.address = req.body['branch-address'],
        branchInfo.startTime = req.body['branch-startTime'],
        branchInfo.endTime = req.body['branch-endTime'],
        branchInfo.status = req.body['branch-status'] == 'on' ? true : false ,
        
        await branchInfo.save();
        req.flash('success', 'Updated successfully');
        return res.redirect('/branches/edit/' + branchId);
    },

    deleteBranch: async function (req, res) {
        let branchId, branchInfo;
        branchId = req.params.branchId;
        if (!this.isLogin(req)) {
            req.session.redirectTo = '/branches';
            return res.redirect('/auth/login');
        }
        if (req.session.user.role != 'root' && !req.session.user.permissions.branchDelete) {
            return res.redirect('/dashboard');
        }

        branchInfo = await BranchModel.findOne({_id: branchId});
        if (!branchInfo) {
            return res.redirect('/dashboard');
        }
        
        BranchModel.deleteOne({_id: branchId}, function (err, result) {
            if (err) {
                req.flash('error', 'Database Error');
                console.log(err);
                return res.redirect('/branches');
            }
            req.flash('success', 'Branch Deleted Successfully!');
            return res.redirect('/branches');
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
