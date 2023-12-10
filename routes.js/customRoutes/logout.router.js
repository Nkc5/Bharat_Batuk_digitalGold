
const express = require('express');
const logout = require('../../controllers/customApi/logout.controller.js');
const router = express.Router();



router.post('/', logout.logoutUser); 


module.exports = router;
