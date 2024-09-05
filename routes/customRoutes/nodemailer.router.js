const express = require('express');
const NodeMailer = require('../../controllers/customApi/nodeMailer.controller');

const router = express.Router();


/* Trade BUY  */
router.post('/', NodeMailer.toSendEmail);




module.exports = router;
