const mongoose = require('mongoose');
const createError = require('http-errors');
const Joi = require('@hapi/joi');
const _ = require('lodash');
const constants = require('./constants');

var FoodModel = require('../models/food.model');
var FoodTransModel = require('../models/foodTrans.model');
var CategoryModel = require('../models/category.model');
var LanguageModel = require('../models/language.model');

var BaseController = require('./BaseController');
var View = require('../views/base');

module.exports = BaseController.extend({
    name: 'FoodController',

    showFoods: async function (req, res) {
        let v, foods;

        if (!this.isLogin(req)) {
            req.session.redirectTo = '/foods';
            return res.redirect('/auth/login');
        }

        if (req.session.user.role != 'root' && !req.session.user.permissions.foodRead) {
            return res.redirect('/dashboard');
        }

        foods = await FoodModel.find()
            .populate({
                path: 'trans', 
                model: 'food_trans', 
                populate: {
                    path: 'languageId', 
                    model: 'language', 
                }})
            .sort({createdAt: 1})
            .exec(function(err, result){
                if (err) {
                    ret.data = "Can't get food list";
                    console.log(err);
                    return res.json(ret);
                }
                return result
            });

        v = new View(res, 'foods/index');
        v.render({
            title: 'Foods',
            foods: foods,
            session: req.session,
            error: req.flash('error'),
            success: req.flash('success')
        });
    },

    showAddFood: async function (req, res) {
        let v;
        if (!this.isLogin(req)) {
            req.session.redirectTo = '/foods/add';
            return res.redirect('/auth/login');
        }
        if (req.session.user.role != 'root' && !req.session.user.permissions.foodInsert) {
            return res.redirect('/dashboard');
        }

        categories = await CategoryModel.find().populate('trans').sort({createdAt: 1}).exec();
        languages = await LanguageModel.find().sort({createdAt: 1});

        v = new View(res, 'foods/edit');
        v.render({
            title: 'Foods',
            pg_mode: 'add',
            categories: categories,
            languages: languages,
            session: req.session,
            error: req.flash('error'),
            success: req.flash('success')
        });
    },

    createFood: async function (req, res) {
        let foodInfo, prevFoodInfo;
        if (!this.isLogin(req)) {
            req.session.redirectTo = '/foods/add';
            return res.redirect('/auth/login');
        }

        if (req.session.user.role != 'root' && !req.session.user.permissions.foodInsert) {
            return res.redirect('/dashboard');
        }
        
        // Check same food with sku address
        prevFoodInfo = await FoodModel.findOne({sku: req.body.sku});
        if (prevFoodInfo) {
            req.flash('error', 'The SKU is already exist.');
            return res.redirect('/foods/add');
        }

        let upload_file, fn, ext, dest_fn, folder;
        upload_file = req.files['food-image'];
        fn = upload_file.name;
        ext = fn.substr(fn.lastIndexOf('.') + 1).toLowerCase();
        folder = this.makeID('food_', 10)
        dest_fn = '/uploads/food/' + folder + "." + ext;
        await upload_file.mv( 'public' + dest_fn, async function (err) {
            if (err) {
                req.flash('error', 'File Uploading Error');
                console.log(err);
                return res.redirect('/foods/add/');
            }
        });

        foodInfo = {
            sku: req.body['food-sku'],
            categoryId: req.body['food-categoryId'] == '' ? null : req.body['food-categoryId'],
            qty: req.body['food-qty'],
            inSlider: req.body['food-inSlider'] == 'on' ? true : false ,
            folder: folder,
            image: dest_fn,
            createdAt: new Date()
        };

        var food = await FoodModel.create(foodInfo);
        var language = await LanguageModel.findOne({abbr: req.body['food-lang']})
        if( food && food._id && language._id ){
            var foodTrans = {
                title: req.body['food-title'],
                desc: req.body['food-description'],
                price: req.body['food-price'],
                oldPrice: req.body['food-oldPrice'],
                extras: req.body['food-extras'],
                abbr: language.abbr,
                foodId: food._id,
                languageId: language._id
            }

            var trans = [];
            foodTrans = await FoodTransModel.create(foodTrans);
            if( foodTrans && foodTrans._id ) trans.push(foodTrans._id);
            food.trans = trans;
            await food.save();
        }

        req.flash('success', 'New food created successfully!');
        return res.redirect('/foods');
    },
    
    showEditFood: async function (req, res) {
        let v, foodInfo, foodId;
        if (!this.isLogin(req)) {
            req.session.redirectTo = '/foods/edit/' + req.params.foodId;
            return res.redirect('/auth/login');
        }

        if (req.session.user.role != 'root' && !req.session.user.permissions.foodUpdate) {
            return res.redirect('/dashboard');
        }

        categories = await CategoryModel.find().populate('trans').sort({createdAt: 1}).exec();
        languages = await LanguageModel.find().sort({createdAt: 1});

        foodId = req.params.foodId;        
        foodInfo = await FoodModel.findOne({_id: foodId}).populate('trans').exec();
        if (!foodInfo) {
            return res.redirect('/dashboard');
        }

        v = new View(res, 'foods/edit');
        v.render({
            title: 'Foods',
            pg_mode: 'edit',
            categories: categories,
            languages: languages,
            food_info: foodInfo,
            session: req.session,
            error: req.flash('error'),
            success: req.flash('success')
        });
    },

    updateFood: async function (req, res) {
        let foodId, foodInfo, prevFood;
        foodId = req.params.foodId;
        if (!this.isLogin(req)) {
            req.session.redirectTo = '/foods/edit/' + foodId;
            return res.redirect('/auth/login');
        }

        if (req.session.user.role != 'root' && !req.session.user.permissions.foodUpdate) {
            return res.redirect('/dashboard');
        }

        foodInfo = await FoodModel.findOne({_id: foodId}).populate('trans').exec();
        if (!foodInfo) {
            return res.redirect('/foods');
        }

        prevFood = await FoodModel.findOne({_id: {$ne: foodInfo._id}, sku: req.body.sku});
        if (prevFood) {
            req.flash('error', 'SKU is already exist. Please change SKU');
            return res.redirect('/foods/edit/' + foodId);
        }

        if( req.files && req.files['food-image'] ){
            let upload_file, fn, ext, dest_fn, folder;
            upload_file = req.files['food-image'];
            fn = upload_file.name;
            ext = fn.substr(fn.lastIndexOf('.') + 1).toLowerCase();
            folder = foodInfo.folder
            dest_fn = '/uploads/food/' + folder + "." + ext;
            await upload_file.mv( 'public' + dest_fn, async function (err) {
                if (err) {
                    req.flash('error', 'File Uploading Error');
                    console.log(err);
                    return res.redirect('/foods/add/');
                }
            });
            foodInfo.image = dest_fn;
        }

        foodInfo.sku = req.body['food-sku'];
        foodInfo.categoryId = req.body['food-categoryId'] == '' ? null : req.body['food-categoryId'];
        foodInfo.qty = req.body['food-qty'];
        foodInfo.inSlider = req.body['food-inSlider'] == 'on' ? true : false;
        foodInfo.updatedAt = new Date();

        var language = await LanguageModel.findOne({abbr: req.body['food-lang']});
        if( language._id ){
            var isExist = false;

            for( var i=0; i<foodInfo.trans.length; i++ ){
                var trans = foodInfo.trans[i];
                if( trans.abbr == language.abbr ){
                    trans.title = req.body['food-title'];
                    trans.desc = req.body['food-description'];
                    trans.price = req.body['food-price'];
                    trans.oldPrice = req.body['food-oldPrice'];
                    trans.extras = req.body['food-extras'];
                    await trans.save();
                    isExist = true;
                    break;
                }
            }
            
            if( !isExist ){
                var foodTrans = {
                    title: req.body['food-title'],
                    desc: req.body['food-description'],
                    price: req.body['food-price'],
                    oldPrice: req.body['food-oldPrice'],
                    abbr: language.abbr,
                    foodId: foodInfo._id,
                    languageId: language._id
                }
    
                foodTrans = await FoodTransModel.create(foodTrans);
                if( foodTrans && foodTrans._id ) {
                    var transIds = [];
                    foodInfo.trans.map(async function( trans ){
                        transIds.push( trans._id )
                    })
                    transIds.push(foodTrans._id);
                }
                foodInfo.trans = transIds;
            }
        }

        await foodInfo.save();
        req.flash('success', 'Updated successfully');
        return res.redirect('/foods/edit/' + foodId);
    },

    deleteFood: async function (req, res) {
        let foodId, foodInfo;
        foodId = req.params.foodId;
        if (!this.isLogin(req)) {
            req.session.redirectTo = '/foods';
            return res.redirect('/auth/login');
        }
        if (req.session.user.role != 'root' && !req.session.user.permissions.foodDelete) {
            return res.redirect('/dashboard');
        }

        foodInfo = await FoodModel.findOne({_id: foodId});
        if (!foodInfo) {
            return res.redirect('/dashboard');
        }
        
        FoodModel.deleteOne({_id: foodId}, function (err, result) {
            if (err) {
                req.flash('error', 'Database Error');
                console.log(err);
                return res.redirect('/foods');
            }
            req.flash('success', 'Food Deleted Successfully!');
            return res.redirect('/foods');
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

    apiGetFoods: async function (req, res) {
        let ret = {status: 'fail', data: ''};

        if (!this.isLogin(req)) {
            ret.data = "Please Login!";
            return res.json(ret);
        }

        FoodModel.find()
            .populate({
                path: 'trans', 
                model: 'food_trans', 
                populate: {
                    path: 'languageId', 
                    model: 'language', 
                }})
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