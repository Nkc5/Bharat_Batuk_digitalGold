
const express = require('express');
const FCM = require('../../controllers/customApi/updateFCM.controller.js');

const router = express.Router();


router.post('/', FCM.updateFCM);



module.exports = router;


