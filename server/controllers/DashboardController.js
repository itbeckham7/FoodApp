const mongoose = require('mongoose');
const createError = require('http-errors');
const Joi = require('@hapi/joi');
const _ = require('lodash');
const constants = require('./constants');

var BaseController = require('./BaseController');
var View = require('../views/base');

module.exports = BaseController.extend({
  name: 'DashboardController',
  
  index: function(req,res) {
      let v;
      if (!this.isLogin(req)) {
          req.session.redirectTo = '/';
          return res.redirect('/auth/login');
      }

      v = new View(res, 'dashboard/index');
      v.render({
          title: 'Dashboard',
          session:req.session
      });
  },
});

