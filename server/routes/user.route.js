var express = require('express');
var router = express.Router();
var userCtrl = require('../controllers/user.controllers');


router.get('/me', userCtrl.getUser);

module.exports = router;