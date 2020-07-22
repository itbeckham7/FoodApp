const express = require('express');
const branchesCtr = require('../../controllers/api/branches.controller');
const createAuthenticationStrategy = require('../../middleware/createAuthenticationStrategy');
const createAuthorizationMiddleware = require('../../middleware/createAuthorizationMiddleware');

const router = express.Router();
const jwtAuthenticate = createAuthenticationStrategy('jwt');
const canReadBranch = createAuthorizationMiddleware('branch', 'read');
const canModifyBranch = createAuthorizationMiddleware('branch', 'modify');

router.use(jwtAuthenticate);

// Preload user object on routes with ':branchId'
router.param('branchId', branchesCtr.preloadTargetBranch);

router.get('/', canReadBranch, branchesCtr.apiGetBranches);

router.post('/', canReadBranch, branchesCtr.apiGetBranchesDatatable);


// router.get('/:branchId', canReadBranch, branchesCtr.apiGetBranch);

// router.put('/:branchId', canModifyBranch, branchesCtr.updateBranch);

// router.delete('/:branchId', canModifyBranch, branchesCtr.deleteBranch);

module.exports = router;
