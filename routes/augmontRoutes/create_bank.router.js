const express = require('express');

const router = express.Router();

const { bankCreate } = require('../../controllers/augmont_api/user-banks-create.controller.js');


router.post('/bankaccount', bankCreate);

module.exports = router;
