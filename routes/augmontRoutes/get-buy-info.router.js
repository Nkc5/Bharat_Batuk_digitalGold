const express = require('express');
const router = express.Router();


const { getBuyInfo } = require('../../controllers/augmont_api/get-buy-info.controller.js');

router.get('/getbuy', getBuyInfo);

module.exports = router;