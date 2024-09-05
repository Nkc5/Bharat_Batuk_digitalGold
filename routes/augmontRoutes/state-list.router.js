const express = require('express');
const router = express.Router();

const { statelist } = require('../../controllers/augmont_api/get-state-list.controller.js');

router.get('/states', statelist);

module.exports = {
    router
}