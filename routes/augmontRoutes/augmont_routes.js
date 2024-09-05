
const express = require('express');
const router = express.Router();

const { restrictToLoggedInUserOnly } = require('../../middlewares/auth.middleware.js')
const login = require('../../controllers/augmont_api/login.js')
const createUserAccount = require('../../controllers/augmont_api/create_user.js')
const { rates } = require('../../controllers/augmont_api/gold-silver-rates.controller.js')
const { Gold } = require('../../controllers/augmont_api/goldPrice.controller.js')
const { productController } = require('../../controllers/augmont_api/product.controller.js');
const userProfile = require('../../controllers/augmont_api/getProfile_user.js');
const { userAddressCreate, userAddressList, userAddressDelete } = require('../../controllers/augmont_api/address_augmont.js')
const { kycUpdate, getKycDetails } = require('../../controllers/augmont_api/kyc_user.js');
const { sell, merchanSellList, getSellInfo } = require('../../controllers/augmont_api/sell_augmont.js');
const { Buy, getBuy, merchantBuyList } = require('../../controllers/augmont_api/get-buy-info.controller.js')
const { buyInvoice, redeemInvoice, sellInvoice } = require('../../controllers/augmont_api/invoice.js')
const { withdraw } = require('../../controllers/augmont_api/withDraw_augmont.js')
const { statelist } = require('../../controllers/augmont_api/get-state-list.controller.js')
const { History } = require('../../controllers/augmont_api/getorderHistory.js')
const { historicalData } = require('../../controllers/augmont_api/historicalData.controller.js')

const { bankCreate, bankList } = require('../../controllers/augmont_api/bank_augmont.js')
const getQuoteBuyAugmont = require('../../controllers/augmont_api/getQuoteBuy.js')
const getQuoteSell = require('../../controllers/augmont_api/get_quote_sell.js');
const passbook = require('../../controllers/augmont_api/portfolio.js');
const { list } = require('../../controllers/augmont_api/Get_Order_List.controller.js')
const commmonReedem = require('../../controllers/augmont_api/commonReedem.js')

const controllerInstance = new productController();



router.post('/login-acces-token', login);

router.get('/products', controllerInstance.Products.bind(controllerInstance));
router.get('/show-product', controllerInstance.showProduct.bind(controllerInstance));
router.get('/goldRates', restrictToLoggedInUserOnly, rates);
router.get('/gold', restrictToLoggedInUserOnly, Gold);



// get quote buy
router.post('/get-quote-buy', restrictToLoggedInUserOnly, getQuoteBuyAugmont)


/******************************Buy ******************************************/
router.post('/buy', restrictToLoggedInUserOnly, Buy)
router.get('/buyInfo/:buyMerchantTxnId', restrictToLoggedInUserOnly, getBuy)
router.get('/merchant', restrictToLoggedInUserOnly, merchantBuyList)

/********************************withdraw ***************************************/

router.get('/withdraw/:sell_txn_id', restrictToLoggedInUserOnly, withdraw)

/**********************************************State-City *******************************************/
router.get('/state/:page', restrictToLoggedInUserOnly, statelist)

/*******************************************History ****************************************/
router.get('/history', restrictToLoggedInUserOnly, History)

router.get('/historicalData', restrictToLoggedInUserOnly, historicalData);


// create user
router.post('/create-user-account', restrictToLoggedInUserOnly, createUserAccount);
router.get('/user-profile-details', restrictToLoggedInUserOnly, userProfile);


// address
router.post('/user-address-create', restrictToLoggedInUserOnly, userAddressCreate);
router.get('/user-address-list', restrictToLoggedInUserOnly, userAddressList);
router.delete('/user-address-delete/:address_id', restrictToLoggedInUserOnly, userAddressDelete)





// get quote sell
router.post('/get-quote-sell', restrictToLoggedInUserOnly, getQuoteSell);

// sell
router.post('/sell-gold-silver', restrictToLoggedInUserOnly, sell);
router.get('/merchant-sell-list', restrictToLoggedInUserOnly, merchanSellList);
router.get('/get-sell-info/:sellMerchantTxnId', restrictToLoggedInUserOnly, getSellInfo);




// redeem
router.get('/buy-invoice/:transactionID', restrictToLoggedInUserOnly, buyInvoice);
router.get('/redeem-invoice/:transactionID', restrictToLoggedInUserOnly, redeemInvoice);
router.get('/sell-invoice/:transactionID', restrictToLoggedInUserOnly, sellInvoice)


router.get('/list', restrictToLoggedInUserOnly, list)



//  bank
router.post('/users-bank-create', restrictToLoggedInUserOnly, bankCreate);
router.get('/users-bank-list', restrictToLoggedInUserOnly, bankList);




// kyc
router.post('/user-kyc-details-update', restrictToLoggedInUserOnly, kycUpdate);
router.get('/user-kyc-details', restrictToLoggedInUserOnly, getKycDetails);


//practice
router.get('/portfolio', restrictToLoggedInUserOnly, passbook);

// common redeem
router.post('/common-redeem', restrictToLoggedInUserOnly, commmonReedem);


module.exports = router;