const express = require('express');
const branchesCtr = require('../../controllers/api/branches.controller');
const createAuthenticationStrategy = require('../../middleware/createAuthenticationStrategy');
const createAuthorizationMiddleware = require('../../middleware/createAuthorizationMiddleware');

const router = express.Router();
const jwtAuthenticate = createAuthenticationStrategy('jwt');
const canReadBranch = createAuthorizationMiddleware('branch', 'read');
const canUpdateBranch = createAuthorizationMiddleware('branch', 'update');
const canDeleteBranch = createAuthorizationMiddleware('branch', 'delete');
const canInsertBranch = createAuthorizationMiddleware('branch', 'insert');

router.use(jwtAuthenticate);

// Preload user object on routes with ':branchId'
router.param('branchId', branchesCtr.preloadTargetBranch);

router.get('/', canReadBranch, branchesCtr.apiGetBranches);

router.post('/', canReadBranch, branchesCtr.apiGetBranchesDatatable);


// router.get('/:branchId', canReadBranch, branchesCtr.apiGetBranch);

// router.put('/:branchId', canUpdateBranch, branchesCtr.updateBranch);

// router.delete('/:branchId', canDeleteBranch, branchesCtr.deleteBranch);

module.exports = router;
