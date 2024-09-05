const express = require('express');
const paymentController = require('../../controllers/customApi/payment.controller');


const router = express.Router();



router.post('/onepay', paymentController.onePay);
router.post('/paynowresponse', paymentController.paynowresponse);






module.exports = router;
