const express = require("express");
const router = express.Router();

const { GetPassbook } = require('../../controllers/augmont_api/get-passbook.controller.js');

const PassbookInstance = new GetPassbook();

router.get('/getpassbook', PassbookInstance.passbook.bind(PassbookInstance));

module.exports = router;