const express = require('express');
const router = express.Router();
const {isAuth} = require('./auth');
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
const profileController = require('../controllers/profileController');

router.get('/:id', isAuth, profileController.getProfile);

router.put('/:id/update', isAuth, profileController.updateProfile);

router.put('/:id/upload', isAuth, upload.single('avatar'), profileController.uploadPic);

module.exports = router;