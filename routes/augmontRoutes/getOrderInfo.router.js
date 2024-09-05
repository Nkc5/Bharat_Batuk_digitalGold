const express = require('express');
const router = express.Router();

const { getOrderInfo } = require('../../controllers/augmont_api/getorderInfo.controller.js');

const OrderInfoInstance = new getOrderInfo();

router.get('/orderinfo/:merchantTransactionId', OrderInfoInstance.orderInfo.bind(OrderInfoInstance));

module.exports = router;