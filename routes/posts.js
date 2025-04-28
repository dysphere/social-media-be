const express = require('express');
const router = express.Router();
const {isAuth} = require("./auth");
const postController = require('../controllers/postController');

router.get('/', isAuth, postController.getPosts);

router.get('/followed', isAuth, postController.getFollowedPosts);

router.get('/:id', isAuth, postController.getPost);

router.post('/new', isAuth, postController.createPost);

router.put('/:id/update', isAuth, postController.updatePost);

router.delete('/:id/delete', isAuth, postController.deletePost);

router.put('/:id/like', isAuth, postController.toggleLikePost);

module.exports = router;