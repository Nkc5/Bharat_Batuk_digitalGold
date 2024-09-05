const express = require('express');
const router = express.Router();

const { BankList } = require('../../controllers/augmont_api/getBankList.controller.js');

const ListInstance = new BankList();

router.get('/bank', ListInstance.getBankList.bind(ListInstance));

module.exports = router;