const express = require('express');
const multer = require('multer');

const createLender = require('../../controllers/finzy-breeze/create-lenders.js')
const uploadDocuments = require('../../controllers/finzy-breeze/upload_documents.js')
const paymentLink = require('../../controllers/finzy-breeze/payment-link.js')
const getInvestmentDetails = require('../../controllers/finzy-breeze/getInvestmentDetails.js')
const LRS = require('../../controllers/finzy-breeze/LRS.js')
const {products}=require('../../controllers/finzy-breeze/products.js')
const {invest}=require("../../controllers/finzy-breeze/Invest.js")
const {withdraw}=require('../../controllers/finzy-breeze/withdraw.js')

const upload = multer({inMemory: true});



const router = express.Router();

router.post('/create-lender', createLender);
router.post('/upload-documents',  upload.array('documents'), uploadDocuments);
router.post('/payment-link', paymentLink);
router.get('/get-investment-details', getInvestmentDetails);
router.get('/lender-LRS-details', LRS);

router.get('/products',products);

router.post('/invest',invest)


router.post('/withdraw',withdraw)

module.exports = router;

