const express = require('express');
const commentsCtr = require('../../controllers/api/comments.controller');
const createAuthenticationStrategy = require('../../middleware/createAuthenticationStrategy');
const createAuthorizationMiddleware = require('../../middleware/createAuthorizationMiddleware');

const router = express.Router();
const jwtAuthenticate = createAuthenticationStrategy('jwt');
const canReadComment = createAuthorizationMiddleware('comment', 'read');
const canUpdateComment = createAuthorizationMiddleware('comment', 'update');
const canDeleteComment = createAuthorizationMiddleware('comment', 'delete');
const canInsertComment = createAuthorizationMiddleware('comment', 'insert');

router.use(jwtAuthenticate);

// Preload user object on routes with ':commentId'ks
router.param('commentId', commentsCtr.preloadTargetComment);

router.get('/:foodId', canReadComment, commentsCtr.apiGetComments);

router.get('/:commentId', canReadComment, commentsCtr.apiGetComment);

router.post('/add/:userId/:foodId', canInsertComment, commentsCtr.apiAddComment);

// router.delete('/:commentId', canDeleteComment, commentsCtr.deleteCategory);

module.exports = router;
