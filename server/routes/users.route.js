const express = require('express');
const createAuthenticationStrategy = require('../middleware/createAuthenticationStrategy');

const router = express.Router();
const jwtAuthenticate = createAuthenticationStrategy('jwt');
const localAuthenticate = createAuthenticationStrategy('local');
const googleAuthenticate = createAuthenticationStrategy('google-token');
const facebookAuthenticate = createAuthenticationStrategy('facebook-token');

user_controller = require('../controllers/UserController');

router.get('/', function (req, res, next) {
    user_controller.showUsers(req, res);
});

router.get('/add', function (req, res) {
    user_controller.showAddUser(req, res);
});

router.get('/edit/:userId', function (req, res) {
    user_controller.showEditUser(req, res);
});

router.post('/add', function (req, res) {
    console.log('-- users/add')
    user_controller.createUser(req, res);
});

router.post('/update/:userId', function (req, res) {
    user_controller.updateUser(req, res);
});

router.get('/delete/:userId', function (req, res) {
    user_controller.deleteUser(req, res);
});

router.get('/reset-password/:userId', function (req, res) {
    user_controller.resetPassword(req, res);
});

router.post('/status', function (req, res) {
    user_controller.getUserStatus(req, res);
});

router.get('/profile/:userId', function (req, res) {
    user_controller.showProfileUser(req, res);
});

router.post('/profile/:userId', function (req, res) {
    user_controller.updateProfile(req, res);
});

module.exports = router;
