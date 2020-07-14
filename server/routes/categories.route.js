const express = require('express');
const createAuthenticationStrategy = require('../middleware/createAuthenticationStrategy');

const router = express.Router();
const jwtAuthenticate = createAuthenticationStrategy('jwt');
const localAuthenticate = createAuthenticationStrategy('local');
const googleAuthenticate = createAuthenticationStrategy('google-token');
const facebookAuthenticate = createAuthenticationStrategy('facebook-token');

category_controller = require('../controllers/CategoryController');

router.get('/', function(req, res, next) {
  category_controller.showCategories(req, res);
});

router.get('/add', function (req, res) {
  category_controller.showAddCategory(req, res);
});

router.get('/edit/:categoryId', function (req, res) {
  category_controller.showEditCategory(req, res);
});

router.post('/add', function (req, res) {
  category_controller.createCategory(req, res);
});

router.post('/update/:categoryId', function (req, res) {
  category_controller.updateCategory(req, res);
});

router.get('/delete/:categoryId', function (req, res) {
  category_controller.deleteCategory(req, res);
});

module.exports = router;

