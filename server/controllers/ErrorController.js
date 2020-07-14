const mongoose = require('mongoose');
const createError = require('http-errors');
const Joi = require('@hapi/joi');
const _ = require('lodash');
const constants = require('./constants');

var BaseController = require('./BaseController');
var View = require('../views/base');

module.exports = BaseController.extend({
    name: 'ErrorController',
    
    show_404:async function(req,res) {
        let v;
        v = new View(res, 'error/404');
        v.render({
            title: 'OOps',
            session:req.session
        });
    },
});
