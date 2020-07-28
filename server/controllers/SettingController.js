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

        if (!this.isLogin(req)) {
            req.session.redirectTo = '/settings';
            return res.redirect('/auth/login');
        }

        if (req.session.user.role != 'root') {
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
        let settingInfo;
        if (!this.isLogin(req)) {
            req.session.redirectTo = '/settings';
            return res.redirect('/auth/login');
        }

        if (req.session.user.role != 'root') {
            return res.redirect('/dashboard');
        }

        var settings = await SettingModel.find();
        if( settings.length > 0 ){
            settingInfo = settings[0]

            settingInfo.homeType = req.body['setting-homeType'];
            settingInfo.startTime = req.body['setting-startTime'];
            settingInfo.endTime = req.body['setting-endTime'];
            await settingInfo.save();
            req.flash('success', 'Updated successfully');
            return res.redirect('/settings');
        }
    },

});
