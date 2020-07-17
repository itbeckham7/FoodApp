const mongoose = require('mongoose');
const createError = require('http-errors');
const Joi = require('@hapi/joi');
const _ = require('lodash');
const constants = require('./constants');

var SettingModel = require('../models/setting.model');

var BaseController = require('./BaseController');
var View = require('../views/base');

module.exports = BaseController.extend({
    name: 'SettingController',

    showEditSetting: async function (req, res) {
        let v;
console.log('-- showEditSetting 1');
        if (!this.isLogin(req)) {
            console.log('-- showEditSetting 2 : ', req.session);
            req.session.redirectTo = '/settings';
            return res.redirect('/auth/login');
        }

        if (req.session.user.role == 'User') {
            console.log('-- showEditSetting 3');
            return res.redirect('/dashboard');
        }

        var settings = await SettingModel.find();
        if( settings.length > 0 ){
            settingId = settings[0]._id;
            settingInfo = settings[0];
            if (!settingInfo) {
                return res.redirect('/dashboard');
            }

            v = new View(res, 'settings/edit');
            v.render({
                title: 'Settings',
                pg_mode: 'edit',
                setting_info: settingInfo,
                session: req.session,
                error: req.flash('error'),
                success: req.flash('success')
            });
        } else {
            return res.redirect('/dashboard');
        }
    },

    updateSetting: async function (req, res) {
        console.log('-- updateSetting 1');
        let settingInfo;
        if (!this.isLogin(req)) {
            console.log('-- updateSetting 2');
            req.session.redirectTo = '/settings';
            return res.redirect('/auth/login');
        }

        if (req.session.user.role == 'User') {
            console.log('-- updateSetting 3');
            return res.redirect('/dashboard');
        }

        var settings = await SettingModel.find();
        if( settings.length > 0 ){
            console.log('-- updateSetting 4 : ', req.body);
            settingInfo = settings[0]

            settingInfo.homeType = req.body['setting-homeType'];
            await settingInfo.save();
            req.flash('success', 'Updated successfully');
            return res.redirect('/settings');
        }
    },

});
