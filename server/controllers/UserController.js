const mongoose = require('mongoose');
const createError = require('http-errors');
const Joi = require('@hapi/joi');
const _ = require('lodash');
const constants = require('./constants');

var UserModel = require('../models/user.model');

var BaseController = require('./BaseController');
var View = require('../views/base');

module.exports = BaseController.extend({
    name: 'UserController',

    showUsers: async function (req, res) {
        let v, users;
        if (!this.isLogin(req)) {
            req.session.redirectTo = '/users';
            return res.redirect('/auth/login');
        }

        if (req.session.user.role == 'User') {
            return res.redirect('/');
        }

        if (req.session.user.role == 'SuperAdmin') {
            users = await UserModel.find({role: {$ne: 'SuperAdmin'}}).sort({createdAt: 1});
        } else {
            users = await UserModel.find({role:'User'}).sort({createdAt: 1});
        }

        v = new View(res, 'users/index');
        v.render({
            title: 'Users',
            users: users,
            session: req.session,
            error: req.flash('error'),
            success: req.flash('success')
        });
    },

    getUserStatus: function (req, res) {
        if (this.isLogin(req)) {
            if (req.session.user) {
                if (req.session.user.role == 'SuperAdmin') {
                    res.json({status: ''})
                } else {
                    UserModel.findOne({_id: req.session.user._id}, function (err, data) {
                        if (err) {
                            res.json({status: 'Disabled'})
                        } else {
                            if (data) {
                                if (data.status) {
                                    res.json({status: 'Enabled'})
                                } else {
                                    res.json({status: 'Disabled'})
                                }
                            } else {
                                res.json({status: 'Disabled'})
                            }
                        }
                    })
                }
            } else {
                res.json({status: ''});
            }
        } else {
            res.json({status: ''})
        }
    },

    showAddUser: async function (req, res) {
        let v;
        if (!this.isLogin(req)) {
            req.session.redirectTo = '/users/add';
            return res.redirect('/auth/login');
        }
        if (req.session.user.role == 'User') {
            return res.redirect('/');
        }

        v = new View(res, 'users/edit');
        v.render({
            title: 'Users',
            pg_mode: 'add',
            session: req.session,
            error: req.flash('error'),
            success: req.flash('success')
        });
    },

    createUser: async function (req, res) {
        let userInfo, prevUserInfo;
        if (!this.isLogin(req)) {
            req.session.redirectTo = '/users/add';
            return res.redirect('/auth/login');
        }

        if (req.session.user.role == 'User') {
            return res.redirect('/');
        }
        
        // Check same user with email address
        prevUserInfo = await UserModel.findOne({email: req.body['user-email']});
        if (prevUserInfo) {
            req.flash('error', 'The Email has already been taken by someone');
            return res.redirect('/users/add');
        }
        
        let upload_file, fn, ext, dest_fn;
        upload_file = req.files['user-picture'];
        fn = upload_file.name;
        ext = fn.substr(fn.lastIndexOf('.') + 1).toLowerCase();
        dest_fn = '/uploads/user/' + this.makeID('user_', 10) + "." + ext;
        await upload_file.mv( 'public' + dest_fn, async function (err) {
            if (err) {
                req.flash('error', 'File Uploading Error');
                console.log(err);
                return res.redirect('/users/add/');
            }
        });

        userInfo = {
            firstName: req.body['user-firstName'],
            lastName: req.body['user-lastName'],
            username: req.body['user-username'],
            email: req.body['user-email'],
            password: crypto.createHash('md5').update(config.default_password).digest("hex"),
            picture: dest_fn,
            contactEmail: '',
            phone: req.body['user-phone'],
            role: req.body['user-role'] ? req.body['user-role'] : 'User',
            status: req.body['user-status'] == 'on' ? true : false,
            emailActive: true,
            ipAddress: '',
            loginCount: 0,
            token: '',
            createdAt: new Date()
        }

        new UserModel(userInfo).save(function (err, result) {
            if (err) {
                console.log(err);
                req.flash('error', 'Database error');
                return res.redirect('/users');
            }
            req.flash('success', 'New user created successfully!');
            return res.redirect('/users');
        })
    },
    
    showEditUser: async function (req, res) {
        let v, userInfo, userId;
        if (!this.isLogin(req)) {
            req.session.redirectTo = '/users/edit/' + req.params.userId;
            return res.redirect('/auth/login');
        }

        if (req.session.user.role == 'User') {
            return res.redirect('/');
        }

        userId = req.params.userId;        
        userInfo = await UserModel.findOne({_id: userId});
        if (!userInfo) {
            return res.redirect('/');
        }

        v = new View(res, 'users/edit');
        v.render({
            title: 'Users',
            pg_mode: 'edit',
            user_info: userInfo,
            session: req.session,
            error: req.flash('error'),
            success: req.flash('success')
        });
    },

    updateUser: async function (req, res) {
        let userId, userInfo, prevUser;
        userId = req.params.userId;
        if (!this.isLogin(req)) {
            req.session.redirectTo = '/users/edit/' + userId;
            return res.redirect('/auth/login');
        }

        if (req.session.user.role == 'User') {
            return res.redirect('/');
        }

        userInfo = await UserModel.findOne({_id: userId});
        if (!userInfo) {
            return res.redirect('/');
        }

        //check email duplication
        prevUser = await UserModel.findOne({_id: {$ne: userInfo._id}, email: req.body['user-email']});
        if (prevUser) {
            req.flash('error', 'Email has been taken by someone!');
            return res.redirect('/users/edit/' + userId);
        }

        if( req.files && req.files['user-picture'] ){
            let upload_file, fn, ext, dest_fn;
            upload_file = req.files['user-picture'];
            fn = upload_file.name;
            ext = fn.substr(fn.lastIndexOf('.') + 1).toLowerCase();
            dest_fn = '/uploads/user/' + this.makeID('user_', 10) + "." + ext;
            await upload_file.mv( 'public' + dest_fn, async function (err) {
                if (err) {
                    req.flash('error', 'File Uploading Error');
                    console.log(err);
                    return res.redirect('/users/edit/' + userId);
                }
            });
            userInfo.picture = dest_fn;
        }
        
        userInfo.firstName = req.body['user-firstName'];
        userInfo.lastName = req.body['user-lastName'];
        userInfo.username = req.body['user-username'];
        userInfo.email = req.body['user-email'];
        userInfo.phone = req.body['user-phone'];
        userInfo.role = req.body['user-role'] ? req.body['user-role'] : 'User';
        userInfo.status = req.body['user-status'] == 'on' ? true : false;

        await userInfo.save();
        req.flash('success', 'Updated successfully');
        return res.redirect('/users/edit/' + userId);
    },

    deleteUser: async function (req, res) {
        let userId, userInfo;
        userId = req.params.userId;
        if (!this.isLogin(req)) {
            req.session.redirectTo = '/users';
            return res.redirect('/auth/login');
        }
        if (req.session.user.role == 'User') {
            return res.redirect('/');
        }

        userInfo = await UserModel.findOne({_id: userId});
        if (!userInfo) {
            return res.redirect('/');
        }
        
        UserModel.deleteOne({_id: userId}, function (err, result) {
            if (err) {
                req.flash('error', 'Database Error');
                console.log(err);
                return res.redirect('/users');
            }
            req.flash('success', 'User Deleted Successfully!');
            return res.redirect('/users');
        })
    },

    resetPassword: async function (req, res) {
        let userId, userInfo;
        userId = req.params.userId;
        if (!this.isLogin(req)) {
            req.session.redirectTo = '/users';
            return res.redirect('/auth/login');
        }
        if (req.session.user.role == 'User') {
            return res.redirect('/');
        }

        userInfo = await UserModel.findOne({_id: userId});
        if (!userInfo) {
            return res.redirect('/');
        }
        
        userInfo.password = crypto.createHash('md5').update(config.default_password).digest("hex");
        userInfo.loginCount = 0;
        userInfo.save(function (err, result) {
            if (err) {
                req.flash('error', 'Database Error');
                console.log(err);
            } else {
                req.flash('success', 'Reset password successfully!');
            }
            res.redirect('/users');
        })
    },


    showProfileUser: async function (req, res) {
        let v, userInfo, userId;
        if (!this.isLogin(req)) {
            req.session.redirectTo = '/users/profile/' + req.params.userId;
            return res.redirect('/auth/login');
        }

        if (req.session.user.role == 'User') {
            return res.redirect('/');
        }

        userId = req.params.userId;        
        userInfo = await UserModel.findOne({_id: userId});
        if (!userInfo) {
            return res.redirect('/');
        }

        v = new View(res, 'users/profile');
        v.render({
            title: 'Profile',
            pg_mode: 'edit',
            user_info: userInfo,
            session: req.session,
            error: req.flash('error'),
            success: req.flash('success')
        });
    },


    updateProfile: async function (req, res) {
        let userId, userInfo, prevUser;
        userId = req.params.userId;
        if (!this.isLogin(req)) {
            req.session.redirectTo = '/users/profile/' + userId;
            return res.redirect('/auth/login');
        }

        if (req.session.user.role == 'User') {
            return res.redirect('/dashboard');
        }

        userInfo = await UserModel.findOne({_id: userId});
        if (!userInfo) {
            return res.redirect('/dashboard');
        }

        //check email duplication
        prevUser = await UserModel.findOne({_id: {$ne: userInfo._id}, email: req.body['user-email']});
        if (prevUser) {
            req.flash('error', 'Email has been taken by someone!');
            return res.redirect('/users/profile/' + userId);
        }

        if( req.files && req.files['user-picture'] ){
            let upload_file, fn, ext, dest_fn;
            upload_file = req.files['user-picture'];
            fn = upload_file.name;
            ext = fn.substr(fn.lastIndexOf('.') + 1).toLowerCase();
            dest_fn = '/uploads/user/' + this.makeID('user_', 10) + "." + ext;
            await upload_file.mv( 'public' + dest_fn, async function (err) {
                if (err) {
                    req.flash('error', 'File Uploading Error');
                    console.log(err);
                    return res.redirect('/users/profile/' + userId);
                }
            });
            userInfo.picture = dest_fn;
        }
        
        userInfo.firstName = req.body['user-firstName'];
        userInfo.lastName = req.body['user-lastName'];
        userInfo.username = req.body['user-username'];
        userInfo.email = req.body['user-email'];
        userInfo.phone = req.body['user-phone'];
        userInfo.status = req.body['user-status'] == 'on' ? true : false;

        await userInfo.save();
        req.session.user = userInfo;
        req.flash('success', 'Updated successfully');
        return res.redirect('/users/profile/' + userId);
    },


/**
     * api functions
     */

    apiGetUsers: async function (req, res) {
        let ret = {status: 'fail', data: ''};
        
        if (!this.isLogin(req)) {
            ret.data = "Please Login!";
            return res.json(ret);
        }

        order = req.body.order;
        search = req.body.search.value;
        pageNum = parseInt(parseInt(req.body.start)/parseInt(req.body.length));
        pageCount = parseInt(req.body.length);
        orderArr = ['email', 'username', 'phone', 'role', 'emailActive', 'ipAddress', 'loginCount', 'status'];
        var query = {
            $or: [
                {email: {$regex: `.*${search}.*`, '$options': 'i'}},
                {username: {$regex: `.*${search}.*`, '$options': 'i'}},
                {phone: {$regex: `.*${search}.*`, '$options': 'i'}},
                {ipAddress: {$regex: `.*${search}.*`, '$options': 'i'}},
                {role: {$regex: `.*${search}.*`, '$options': 'i'}},
            ]
        };

        if (req.session.user.role == 'SuperAdmin') {
            query.role = {$ne: 'SuperAdmin'};
        } else {
            query.role = 'SuperAdmin';
        }

        var totalItems = await UserModel.find(query).select('_id');
        totalItems = totalItems.length;
        console.log('-- totalItems : ', totalItems);

        UserModel.find(query)
            .limit(pageCount)
            .skip(pageCount * pageNum)
            .sort([[orderArr[parseInt(order[0].column)], order[0].dir == 'asc'? 1:-1]])
            .exec(function(err, result){
                if (err) {
                    ret.data = "Can't get user list";
                    console.log(err);
                    return res.json(ret);
                }
                console.log('-- result : ', result)
                ret.data = {
                    draw: 1,
                    recordsTotal: totalItems,
                    recordsFiltered: totalItems,
                    data: result
                };
                ret.status = 'success';
                
                return res.json(ret);
            })
    },
});
