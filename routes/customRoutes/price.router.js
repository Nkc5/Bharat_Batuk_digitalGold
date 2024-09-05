
const express  = require('express');
const tradePrice = require('../../controllers/customApi/tradePrice.controller.js');


const router = express.Router();


router.post('/gold', tradePrice.goldPrice);
router.post('/silver', tradePrice.silverPrice);


module.exports = router;