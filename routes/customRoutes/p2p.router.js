
const express = require('express');
const router = express.Router();
const { GetTransactionByExtTxnId, api, IsInvestorExist } = require('../../controllers/customApi/p2p.controller.js')
const { restrictToLoggedInUserOnly } = require('../../middlewares/auth.middleware.js')


router.get('/api', api)
router.post('/investor', restrictToLoggedInUserOnly, IsInvestorExist)

router.all('/GetTransactionByExtTxnId', GetTransactionByExtTxnId)
// router.get('/GetTransactionByExtTxnId/:TransactionId/:InvestorId', GetTransactionByExtTxnId)


const Investor = require('../../controllers/custom_liquiloan_api/createInvestor.js');
const investor = new Investor();
router.post('/createInvestor', restrictToLoggedInUserOnly, investor.createInvestor)



// function httpsToHttp(req, res, next) {
//     console.log("in httpToHttps");
//     console.log("req", req);

//     if (req.secure) {
//         const host = req.headers['host'];
//         const url = req.url;
//         console.log('host', host);
//         console.log('url', url);
//         return res.redirect(`http://${host}${url}`);
//     }
// }


module.exports = router;