const express = require('express');
const router = express.Router();
const isAuth = require("./auth");
const commentController = require('../controllers/commentController');

router.get('/:id', isAuth, commentController.getPostComments);

router.post('/:id/new', isAuth, commentController.createPostComment);

router.put('/:postId/:commentId/update', isAuth, commentController.updatePostComment);

router.delete('/:postId/:commentId/delete', isAuth, commentController.deletePostComment);

module.exports = router;