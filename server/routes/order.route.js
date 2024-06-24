var express = require('express');
var router = express.Router();
var orderController = require('../controllers/order.controller');

router.post('/create-payment', orderController.createPayment);
router.get('/vnpayReturn', orderController.vnpayReturn);

module.exports = router;

