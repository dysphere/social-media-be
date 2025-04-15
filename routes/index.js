const express = require('express');
const router = express.Router();
const indexController = require('../controllers/indexController');

router.post('/signup', indexController.createUserPost);

router.post('/login', indexController.userLoginPost);

router.post('/logout', indexController.userLogoutPost);

module.exports = router;
