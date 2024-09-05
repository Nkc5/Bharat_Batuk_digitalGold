
const express = require('express');
const logout = require('../../controllers/customApi/logout.controller.js');
const router = express.Router();



router.post('/', logout.logoutUser); 
router.post('/deleteAccount',logout.deleteAccount);

module.exports = router;
