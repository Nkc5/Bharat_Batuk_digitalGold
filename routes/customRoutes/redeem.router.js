const express = require('express');
const redeemController = require('../../controllers/customApi/redeem.controller');



const router = express.Router();

router.get('/getRedemptionCatalog', redeemController.getRedemptionCatalog);
router.post('/validateRedeemOrderForPartnerPg', redeemController.validateRedeemOrderForPartnerPg);
router.post('/executeRedeemOrderForPartnerPg', redeemController.executeRedeemOrderForPartnerPg);


module.exports = router;
