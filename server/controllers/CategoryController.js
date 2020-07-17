const mongoose = require('mongoose');
const createError = require('http-errors');
const Joi = require('@hapi/joi');
const _ = require('lodash');
const constants = require('./constants');

var CategoryModel = require('../models/category.model');
var CategoryTransModel = require('../models/categoryTrans.model');
var LanguageModel = require('../models/language.model');

var BaseController = require('./BaseController');
var View = require('../views/base');

module.exports = BaseController.extend({
    name: 'CategoryController',

    showCategories: async function (req, res) {
        let v, categories;
        if (!this.isLogin(req)) {
            req.session.redirectTo = '/categories';
            return res.redirect('/auth/login');
        }

        if (req.session.user.role == 'User') {
            return res.redirect('/');
        }

        categories = await CategoryModel.find().sort({createdAt: 1});
        
        v = new View(res, 'categories/index');
        v.render({
            title: 'Categories',
            categories: categories,
            session: req.session,
            error: req.flash('error'),
            success: req.flash('success')
        });
    },

    showAddCategory: async function (req, res) {
        let v, categories, languages;
        if (!this.isLogin(req)) {
            req.session.redirectTo = '/categories/add';
            return res.redirect('/auth/login');
        }
        if (req.session.user.role == 'User') {
            return res.redirect('/*');
        }

        categories = await CategoryModel.find().populate('trans').sort({createdAt: 1}).exec();
        languages = await LanguageModel.find().sort({createdAt: 1});

        v = new View(res, 'categories/edit');
        v.render({
            title: 'Categories',
            pg_mode: 'add',
            categories: categories,
            languages: languages,
            session: req.session,
            error: req.flash('error'),
            success: req.flash('success')
        });
    },

    createCategory: async function (req, res) {
        let categoryInfo, prevCategoryInfo;
        if (!this.isLogin(req)) {
            req.session.redirectTo = '/categories/add';
            return res.redirect('/auth/login');
        }

        if (req.session.user.role == 'User') {
            return res.redirect('/*');
        }
        
        // Check same category with sku address
        prevCategoryInfo = await CategoryModel.findOne({slug: req.body['category-slug']});
        if (prevCategoryInfo) {
            req.flash('error', 'The SKU is already exist.');
            return res.redirect('/categories/add');
        }
        
        let upload_file, fn, ext, dest_fn;
        upload_file = req.files['category-image'];
        fn = upload_file.name;
        ext = fn.substr(fn.lastIndexOf('.') + 1).toLowerCase();
        dest_fn = '/uploads/category/' + this.makeID('category_', 10) + "." + ext;
        await upload_file.mv( 'public' + dest_fn, async function (err) {
            if (err) {
                req.flash('error', 'File Uploading Error');
                console.log(err);
                return res.redirect('/categories/add/');
            }
        });

        categoryInfo = {
            slug: req.body['category-slug'],
            parentId: req.body['category-parentId'] == '' ? null : req.body['category-parentId'],
            position: req.body['category-position'],
            image: dest_fn,
            createdAt: new Date()
        };
        
        var cat = await CategoryModel.create(categoryInfo);
        if( cat && cat._id ){
            languages = await LanguageModel.find().sort({createdAt: 1});
            var trans = [];
            for( var i=0; i<languages.length; i++ ){
                var categoryTrans = {
                    name: req.body['category-name-' + languages[i].abbr],
                    abbr: languages[i].abbr,
                    categoryId : cat._id
                }

                var catTrans = await CategoryTransModel.create(categoryTrans);
                if( catTrans && catTrans._id ) trans.push(catTrans._id);
            }

            cat = await CategoryModel.findOne({_id: cat._id});
            cat.trans = trans;
            await cat.save();
        }

        req.flash('success', 'New category created successfully!');
        return res.redirect('/categories');
    },
    
    showEditCategory: async function (req, res) {
        let v, categoryInfo, categoryId;
        if (!this.isLogin(req)) {
            req.session.redirectTo = '/categories/edit/' + req.params.categoryId;
            return res.redirect('/auth/login');
        }

        if (req.session.user.role == 'User') {
            return res.redirect('/*');
        }

        categories = await CategoryModel.find().populate('trans').sort({createdAt: 1}).exec();
        languages = await LanguageModel.find().sort({createdAt: 1});

        categoryId = req.params.categoryId;        
        categoryInfo = await CategoryModel.findOne({_id: categoryId}).populate('trans').exec();
        if (!categoryInfo) {
            return res.redirect('/*');
        }

        v = new View(res, 'categories/edit');
        v.render({
            title: 'Category',
            pg_mode: 'edit',
            categories: categories,
            languages: languages,
            category_info: categoryInfo,
            session: req.session,
            error: req.flash('error'),
            success: req.flash('success')
        });
    },

    updateCategory: async function (req, res) {
        let categoryId, categoryInfo, prevCategory;
        categoryId = req.params.categoryId;
        if (!this.isLogin(req)) {
            req.session.redirectTo = '/categories/edit/' + categoryId;
            return res.redirect('/auth/login');
        }

        if (req.session.user.role == 'User') {
            return res.redirect('/dashboard');
        }

        categoryInfo = await CategoryModel.findOne({_id: categoryId}).populate('trans').exec();
        if (!categoryInfo) {
            return res.redirect('/categories');
        }

        prevCategory = await CategoryModel.findOne({_id: {$ne: categoryInfo._id}, slug: req.body['category-slug']});
        if (prevCategory) {
            req.flash('error', 'Slug is already exist. Please change Slug');
            return res.redirect('/categories/edit/' + categoryId);
        }
        
        if( req.files && req.files['category-image'] ){
            let upload_file, fn, ext, dest_fn;
            upload_file = req.files['category-image'];
            fn = upload_file.name;
            ext = fn.substr(fn.lastIndexOf('.') + 1).toLowerCase();
            dest_fn = '/uploads/category/' + this.makeID('category_', 10) + "." + ext;
            await upload_file.mv( 'public' + dest_fn, async function (err) {
                if (err) {
                    req.flash('error', 'File Uploading Error');
                    console.log(err);
                    return res.redirect('/categories/edit/' + categoryId);
                }
            });
            categoryInfo.image = dest_fn;
        }
        
        
        categoryInfo.slug = req.body['category-slug'],
        categoryInfo.parentId = req.body['category-parentId'] == '' ? null : req.body['category-parentId'],
        categoryInfo.position = req.body['category-position'],
        

        categoryInfo.trans.map(async function( trans ){
            trans.name = req.body['category-name-' + trans.abbr];
            await trans.save();
        })
        
        await categoryInfo.save();
        req.flash('success', 'Updated successfully');
        return res.redirect('/categories/edit/' + categoryId);
    },

    deleteCategory: async function (req, res) {
        let categoryId, categoryInfo;
        categoryId = req.params.categoryId;
        if (!this.isLogin(req)) {
            req.session.redirectTo = '/categories';
            return res.redirect('/auth/login');
        }
        if (req.session.user.role == 'User') {
            return res.redirect('/dashboard');
        }

        categoryInfo = await CategoryModel.findOne({_id: categoryId                                                                             });
        if (!categoryInfo) {
            return res.redirect('/*');
        }
        
        CategoryModel.deleteOne({_id: categoryId}, function (err, result) {
            if (err) {
                req.flash('error', 'Database Error');
                console.log(err);
                return res.redirect('/categories');
            }
            req.flash('success', 'Category Deleted Successfully!');
            return res.redirect('/categories');
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

    apiGetCategories: async function (req, res) {
        let ret = {status: 'fail', data: ''};

        if (!this.isLogin(req)) {
            ret.data = "Please Login!";
            return res.json(ret);
        }

        CategoryModel.find()
            .populate('trans')
            .populate({
                path: 'parentId', 
                model: 'category', 
                populate: {
                    path: 'trans', 
                    model: 'category_trans', 
                }})
            .exec(function(err, result){
                if (err) {
                    ret.data = "Can't get catalog list";
                    console.log(err);
                    return res.json(ret);
                }
                ret.data = result;
                ret.status = 'success';
                res.json(ret);
            })
    },
});
