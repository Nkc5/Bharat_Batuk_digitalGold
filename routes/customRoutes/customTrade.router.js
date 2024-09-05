const express = require('express');
const tradeBuyController = require('../../controllers/customApi/tradeBuy.controller');
const tradeSellController = require('../../controllers/customApi/tradeSell.controller');

const tradeController = require('../../controllers/customApi/tradeBuy.controller');


const router = express.Router();


/* Trade BUY  */
router.post('/getNonExecutableQuote', tradeBuyController.getNonExecutableQuote);
router.post('/buy', tradeBuyController.buy);
router.post('/validateBuy', tradeBuyController.validateBuy);
router.post('/executeBuy', tradeBuyController.executeBuy);
router.post('/getOrderHistory',tradeBuyController.getOrderHistory);
router.post('/getOrderDetails',tradeBuyController.getOrderDetails);
router.post('/getRedeemHistory',tradeBuyController.getRedeemHistory);
router.post('/getDeliveryStatus',tradeBuyController.getDeliveryStatus);
router.post('/checkTradeStatus',tradeBuyController.checkTradeStatus);
router.post('/initiateTransfer',tradeBuyController.initiateTransfer);
router.post('/confirmTransfer',tradeBuyController.confirmTransfer);
router.post('/transfer',tradeBuyController.transfer);
router.post('/buyAndTransferPartnerPg',tradeBuyController.buyAndTransferPartnerPg);


// router.post('/validateBuyNew', tradeBuyController.validateBuyNew);
// router.post('/executeBuyNew', tradeBuyController.executeBuyNew);


/* Trade SELL  */

router.post('/sell', tradeSellController.sell);
router.post('/executeSell', tradeSellController.executeSell)



// vpa
router.post('/vpaValidate', tradeSellController.vpaValidate);


// invoice
router.post('/generateBuyPdfInvoice', tradeBuyController.generateBuyPdfInvoice);
router.post('/generateSellPdfInvoice', tradeSellController.generateSellPdfInvoice);



module.exports = router;
