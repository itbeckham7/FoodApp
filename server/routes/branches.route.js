const express = require('express');
const createAuthenticationStrategy = require('../middleware/createAuthenticationStrategy');

const router = express.Router();
const jwtAuthenticate = createAuthenticationStrategy('jwt');
const localAuthenticate = createAuthenticationStrategy('local');
const googleAuthenticate = createAuthenticationStrategy('google-token');
const facebookAuthenticate = createAuthenticationStrategy('facebook-token');

branch_controller = require('../controllers/BranchController');

router.get('/', function(req, res, next) {
  branch_controller.showBranches(req, res);
});

router.get('/add', function (req, res) {
  branch_controller.showAddBranch(req, res);
});

router.get('/edit/:branchId', function (req, res) {
  branch_controller.showEditBranch(req, res);
});

router.post('/add', function (req, res) {
  branch_controller.createBranch(req, res);
});

router.post('/update/:branchId', function (req, res) {
  branch_controller.updateBranch(req, res);
});

router.get('/delete/:branchId', function (req, res) {
  branch_controller.deleteBranch(req, res);
});

module.exports = router;
