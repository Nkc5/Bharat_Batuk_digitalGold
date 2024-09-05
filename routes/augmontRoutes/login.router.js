
const express = require('express');
const router = express.Router();

const login = require('../../controllers/augmont_api/login.js')

router.post('login-acces-token', login);



module.exports = router;