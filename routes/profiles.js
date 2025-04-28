const express = require('express');
const router = express.Router();
const {isAuth} = require('./auth');
const profileController = require('../controllers/profileController');

router.get('/', isAuth, profileController.getProfiles);

router.get('/:id', isAuth, profileController.getProfile);

router.put('/:id/update', isAuth, profileController.updateProfile);

module.exports = router;