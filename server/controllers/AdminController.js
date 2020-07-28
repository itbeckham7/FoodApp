const mongoose = require('mongoose');
const createError = require('http-errors');
const Joi = require('@hapi/joi');
const _ = require('lodash');
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
    name: 'AdminController',

    showAdmins: async function (req, res) {
        let v, admins;
        if (!this.isLogin(req)) {
            req.session.redirectTo = '/admins';
            return res.redirect('/auth/login');
        }

        if (req.session.user.role != 'root') {
            return res.redirect('/');
        }

        admins = await UserModel.find({role: 'root'}).sort({createdAt: 1});

        v = new View(res, 'admins/index');
        v.render({
            title: 'Admins',
            admins: admins,
            session: req.session,
            error: req.flash('error'),
            success: req.flash('success')
        });
    },

    showAddAdmin: async function (req, res) {
        let v;
        if (!this.isLogin(req)) {
            req.session.redirectTo = '/admins/add';
            return res.redirect('/auth/login');
        }
        if (req.session.user.role != 'root') {
            return res.redirect('/');
        }
        
        v = new View(res, 'admins/edit');
        v.render({
            title: 'Admins',
            pg_mode: 'add',
            session: req.session,
            permissions: config.permissions,
            error: req.flash('error'),
            success: req.flash('success')
        });
    },

    createAdmin: async function (req, res) {
        let adminInfo, prevAdminInfo;
        if (!this.isLogin(req)) {
            req.session.redirectTo = '/admins/add';
            return res.redirect('/auth/login');
        }

        if (req.session.user.role != 'root') {
            return res.redirect('/');
        }
        
        // Check same admin with email address
        prevAdminInfo = await UserModel.findOne({email: req.body['admin-email']});
        if (prevAdminInfo) {
            req.flash('error', 'The Email has already been taken by someone');
            return res.redirect('/admins/add');
        }
        
        let upload_file, fn, ext, dest_fn;
        upload_file = req.files['admin-picture'];
        fn = upload_file.name;
        ext = fn.substr(fn.lastIndexOf('.') + 1).toLowerCase();
        dest_fn = '/uploads/admin/' + this.makeID('admin_', 10) + "." + ext;
        await upload_file.mv( 'public' + dest_fn, async function (err) {
            if (err) {
                req.flash('error', 'File Uploading Error');
                console.log(err);
                return res.redirect('/admins/add/');
            }
        });

        adminInfo = {
            firstName: req.body['admin-firstName'],
            lastName: req.body['admin-lastName'],
            username: req.body['admin-username'],
            email: req.body['admin-email'],
            contactEmail: '',
            phone: req.body['admin-phone'],
            role: 'admin',
            status: req.body['admin-status'] == 'on' ? 'active' : 'disabled',
            emailActive: true,
            ipAddress: '',
            loginCount: 0,
            token: '',
            createdAt: new Date()
        }

        newAdmin = new UserModel(adminInfo);
        newAdmin.setSubId();
        newAdmin.provider.local = {
            userId: newAdmin._id,
            picture: dest_fn
        };

        await newAdmin.setPasswordAsync(config.default_password);

        if (config.auth.verifyEmail && !isOauthAccount) {
            newAdmin.setToken('verify-email');
            newAdmin.status = 'unverified-email';
        }

        newAdmin.save(function (err, result) {
            if (err) {
                console.log(err);
                req.flash('error', 'Database error');
                return res.redirect('/admins');
            }

            if (config.auth.verifyEmail && !isOauthAccount) {
                return sendVerificationEmailAsync(user).then((result) => {
                    req.flash('success', 'A verification email has been sent to your email');
                    return res.redirect('/auth/register');
                });
            }

            req.flash('success', 'New admin created successfully!');
            return res.redirect('/admins');
        })
    },
    
    showEditAdmin: async function (req, res) {
        let v, adminInfo, adminId;
        if (!this.isLogin(req)) {
            req.session.redirectTo = '/admins/edit/' + req.params.adminId;
            return res.redirect('/auth/login');
        }

        if (req.session.user.role != 'root') {
            return res.redirect('/');
        }

        adminId = req.params.adminId;        
        adminInfo = await UserModel.findOne({_id: adminId});
        if (!adminInfo) {
            return res.redirect('/');
        }

        v = new View(res, 'admins/edit');
        v.render({
            title: 'Admins',
            pg_mode: 'edit',
            admin_info: adminInfo,
            session: req.session,
            permissions: config.permissions,
            error: req.flash('error'),
            success: req.flash('success')
        });
    },

    updateAdmin: async function (req, res) {
        let adminId, adminInfo, prevAdmin;
        adminId = req.params.adminId;
        if (!this.isLogin(req)) {
            req.session.redirectTo = '/admins/edit/' + adminId;
            return res.redirect('/auth/login');
        }

        if (req.session.user.role != 'root') {
            return res.redirect('/');
        }

        adminInfo = await UserModel.findOne({_id: adminId});
        if (!adminInfo) {
            return res.redirect('/');
        }
        
        //check email duplication
        prevAdmin = await UserModel.findOne({_id: {$ne: adminInfo._id}, email: req.body['admin-email']});
        if (prevAdmin) {
            req.flash('error', 'Email has been taken by someone!');
            return res.redirect('/admins/edit/' + adminId);
        }

        if( req.files && req.files['admin-picture'] ){
            let upload_file, fn, ext, dest_fn;
            upload_file = req.files['admin-picture'];
            fn = upload_file.name;
            ext = fn.substr(fn.lastIndexOf('.') + 1).toLowerCase();
            dest_fn = '/uploads/admin/' + this.makeID('admin_', 10) + "." + ext;
            await upload_file.mv( 'public' + dest_fn, async function (err) {
                if (err) {
                    req.flash('error', 'File Uploading Error');
                    console.log(err);
                    return res.redirect('/admins/edit/' + adminId);
                }
            });
            adminInfo.picture = dest_fn;
        }
        
        adminInfo.firstName = req.body['admin-firstName'];
        adminInfo.lastName = req.body['admin-lastName'];
        adminInfo.username = req.body['admin-username'];
        adminInfo.email = req.body['admin-email'];
        adminInfo.phone = req.body['admin-phone'];
        adminInfo.role = 'admin';
        adminInfo.status = req.body['admin-status'] == 'on' ? 'active' : 'disabled';

        for(var i=0; i<config.permissions.length; i++){
            var permission = config.permissions[i];
            for(var j=0; j<permission.actions.length; j++){
                var action = permission.actions[j];
                adminInfo.permissions[permission.model + action.action] = req.body[permission.model + action.action]
            }
        }

        await adminInfo.save();
        req.flash('success', 'Updated successfully');
        return res.redirect('/admins/edit/' + adminId);
    },

    deleteAdmin: async function (req, res) {
        let adminId, adminInfo;
        adminId = req.params.adminId;
        if (!this.isLogin(req)) {
            req.session.redirectTo = '/admins';
            return res.redirect('/auth/login');
        }
        if (req.session.user.role != 'root') {
            return res.redirect('/');
        }

        adminInfo = await UserModel.findOne({_id: adminId});
        if (!adminInfo) {
            return res.redirect('/');
        }
        
        UserModel.deleteOne({_id: adminId}, function (err, result) {
            if (err) {
                req.flash('error', 'Database Error');
                console.log(err);
                return res.redirect('/admins');
            }
            req.flash('success', 'Admin Deleted Successfully!');
            return res.redirect('/admins');
        })
    },

    resetPassword: async function (req, res) {
        let adminId, adminInfo;
        adminId = req.params.adminId;
        if (!this.isLogin(req)) {
            req.session.redirectTo = '/admins';
            return res.redirect('/auth/login');
        }
        if (req.session.user.role != 'root') {
            return res.redirect('/');
        }

        adminInfo = await UserModel.findOne({_id: adminId});
        if (!adminInfo) {
            return res.redirect('/');
        }
        
        await adminInfo.setPasswordAsync(config.default_password);
        adminInfo.loginCount = 0;
        adminInfo.save(function (err, result) {
            if (err) {
                req.flash('error', 'Database Error');
                console.log(err);
            } else {
                req.flash('success', 'Reset password successfully!');
            }
            res.redirect('/admins');
        })
    },

});
