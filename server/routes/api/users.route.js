const express = require('express');
const usersCtr = require('../../controllers/api/users.controller');
const createAuthenticationStrategy = require('../../middleware/createAuthenticationStrategy');
const createUserAuthorizationMiddleware = require('../../middleware/createUserAuthorizationMiddleware');

const router = express.Router();
const jwtAuthenticate = createAuthenticationStrategy('jwt');
const canReadUser = createUserAuthorizationMiddleware('read');
const canUpdateUser = createUserAuthorizationMiddleware('update');
const canDeleteUser = createUserAuthorizationMiddleware('delete');
const canInsertUser = createUserAuthorizationMiddleware('insert');

router.use(jwtAuthenticate);

// Preload user object on routes with ':userId'
router.param('userId', usersCtr.preloadTargetUser);

router.get('/', canReadUser, usersCtr.getUsers);

router.get('/:userId', canReadUser, usersCtr.getUser);

router.put('/:userId', canUpdateUser, usersCtr.updateUser);

router.delete('/:userId', canDeleteUser, usersCtr.deleteUser);

router.post('/', canReadUser, usersCtr.apiGetUsers);

module.exports = router;
