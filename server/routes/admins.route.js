const express = require('express');
const createAuthenticationStrategy = require('../middleware/createAuthenticationStrategy');
const createUserAuthorizationMiddleware = require('../middleware/createUserAuthorizationMiddleware');

const router = express.Router();

admin_controller = require('../controllers/AdminController');

router.get('/', function (req, res, next) {
    admin_controller.showAdmins(req, res);
});

router.get('/add', function (req, res) {
    admin_controller.showAddAdmin(req, res);
});

router.get('/edit/:adminId', function (req, res) {
    admin_controller.showEditAdmin(req, res);
});

router.post('/add', function (req, res) {
    admin_controller.createAdmin(req, res);
});

router.post('/update/:adminId', function (req, res) {
    admin_controller.updateAdmin(req, res);
});

router.get('/delete/:adminId', function (req, res) {
    admin_controller.deleteAdmin(req, res);
});

router.get('/reset-password/:adminId', function (req, res) {
    admin_controller.resetPassword(req, res);
});

module.exports = router;
