const mongoose = require('mongoose');
const createError = require('http-errors');
const Joi = require('@hapi/joi');
const _ = require('lodash');
const email = require('../core/sendgrid');
const constants = require('./constants');
const config = require('../config')

var UserModel = require('../models/user.model');

var BaseController = require('./BaseController');
var View = require('../views/base');

const sendVerificationEmailAsync = (user) => {
    return sendEmailHelperAsync(
        user,
        'Verify your email',
        `Welcome to ${config.app.title}`,
        'Before you can start using your account, please verify it by following the link below:',
        'Verify Email',
        `${config.server.publicUrl}/verify-email/${user.token}` // FIXME: fix port number
    );
};

const sendEmailHelperAsync = (
    user,
    subject,
    title,
    content,
    buttonText,
    url
) => {
    return email.send({
        to: user.email,
        from: `${config.app.title} <${config.email.from}>`,
        subject: `${config.app.title} - ${subject}`,
        templatePath: `${config.paths.root}/templates/email.html`,
        dynamicTemplateData: {
            boxTitle: title,
            firstName: user.firstName,
            content,
            buttonText,
            url,
            signature: config.email.signature,
        },
    });
};

module.exports = BaseController.extend({
    name: 'UserController',

    showUsers: async function (req, res) {
        let v, users;
        if (!this.isLogin(req)) {
            req.session.redirectTo = '/users';
            return res.redirect('/auth/login');
        }

        if (req.session.user.role != 'root' && !req.session.user.permissions.userRead) {
            return res.redirect('/');
        }

        users = await UserModel.find({role:'user'}).sort({createdAt: 1});

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
                if (req.session.user.role == 'root') {
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

        if (req.session.user.role != 'root' && !req.session.user.permissions.userInsert) {
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

        if (req.session.user.role != 'root' && !req.session.user.permissions.userInsert) {
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
            contactEmail: '',
            phone: req.body['user-phone'],
            role: 'user',
            status: req.body['user-status'] == 'on' ? 'active' : 'disabled',
            emailActive: true,
            ipAddress: '',
            loginCount: 0,
            token: '',
            createdAt: new Date()
        }

        newUser = new UserModel(userInfo);
        newUser.setSubId();
        newUser.provider.local = {
            userId: newUser._id,
            picture: dest_fn
        };

        await newUser.setPasswordAsync(config.default_password);

        if (config.auth.verifyEmail && !isOauthAccount) {
            newUser.setToken('verify-email');
            newUser.status = 'unverified-email';
        }

        newUser.save(function (err, result) {
            if (err) {
                console.log(err);
                req.flash('error', 'Database error');
                return res.redirect('/users');
            }

            if (config.auth.verifyEmail && !isOauthAccount) {
                return sendVerificationEmailAsync(user).then((result) => {
                    req.flash('success', 'A verification email has been sent to your email');
                    return res.redirect('/auth/register');
                });
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

        if (req.session.user.role != 'root' && !req.session.user.permissions.userUpdate) {
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

        if (req.session.user.role != 'root' && !req.session.user.permissions.userUpdate) {
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
        userInfo.role = 'user';
        userInfo.status = req.body['user-status'] == 'on' ? 'active' : 'disabled';

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

        if (req.session.user.role != 'root' && !req.session.user.permissions.userDelete) {
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
        
        if (req.session.user.role != 'root' && !req.session.user.permissions.userUpdate) {
            return res.redirect('/');
        }

        userInfo = await UserModel.findOne({_id: userId});
        if (!userInfo) {
            return res.redirect('/');
        }
        
        await userInfo.setPasswordAsync(config.default_password);
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

        if (req.session.user.role == 'user') {
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

        if (req.session.user.role != 'root' && !req.session.user.permissions.userUpdate) {
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

});
