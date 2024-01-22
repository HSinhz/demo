const express = require('express');
const router = express.Router();
const userController = require('../app/controllers/UserController');
const { checkUserJWT } = require('../middleware/checkuserlogin');

// detailsController.index
router.post('api/login',  userController.handlerLogin);
router.get('home', checkUserJWT , userController.index);
module.exports = router;