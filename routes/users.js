const express = require('express');
const router = express.Router();
const isAuth = require('./auth');
const userController = require('../controllers/userController');

router.get('/', isAuth, userController.getUsers);

router.get('/:id', isAuth, userController.getUser);

router.get('/current', isAuth, userController.getCurrentUser);

router.post('/:id/follow', isAuth, userController.toggleFollowUser);

module.exports = router;
