const express = require('express');
const router = express.Router();
const investorController = require('../../controllers/custom_liquiloan_api/isInvestorExist.js');
const GetInvestmentdashboard = require('../../controllers/custom_liquiloan_api/GetInvestordashboard.js');
const {CreateInvestmentPaymentGateway} = require('../../controllers/custom_liquiloan_api/paymentGateway.js');
const GetInvestmentScheme = require('../../controllers/custom_liquiloan_api/GetInvestmentScheme.js');
const GetInvestmentSummary = require('../../controllers/custom_liquiloan_api/GetInvestmentSummary.js');
const {WithdrawMoneyInvestor} = require('../../controllers/custom_liquiloan_api/withdrawMoneyInvestor.js');
const {GetMaturityLinkOTP, CreateMaturityAction} = require('../../controllers/custom_liquiloan_api/linkOTP.js');
const GetInvestorMaturityTransactions = require('../../controllers/custom_liquiloan_api/matuarityTransaction.js');
const getCashLedger = require('../../controllers/custom_liquiloan_api/getCashLedger.js');
const uploadInvestorDocs = require('../../controllers/custom_liquiloan_api/uploadInvestorDocs.js');





router.post('/investor', investorController.IsInvestorExist);
// router.post('/summary', investorController.dashboard);
router.post('/summary', investorController.summary);
router.post('/Investment', GetInvestmentScheme.scheme);
router.post('/getdash', GetInvestmentdashboard.dashboard);
// router.post('/summary', GetInvestmentSummary.Getsummary);
router.post('/CreateInvestmentPaymentGateway', CreateInvestmentPaymentGateway);
router.post('/WithdrawMoneyInvestor', WithdrawMoneyInvestor);
router.post('/GetInvestorMaturityTransactions', GetInvestorMaturityTransactions);
router.post('/CreateMaturityAction', CreateMaturityAction);
router.post('/GetMaturityLinkOTP', GetMaturityLinkOTP);
router.post('/getCashLedger', getCashLedger);
router.post('/uploadInvestorDocs', uploadInvestorDocs);




module.exports = router;
