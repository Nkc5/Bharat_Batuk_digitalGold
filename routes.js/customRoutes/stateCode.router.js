const express = require('express');
const StateCodeController = require('../../controllers/customApi/stateCode.controller.js');
const router = express.Router();

router.post('/insertStateCodes', StateCodeController.insertStateCodes);
router.get('/getstateCode',StateCodeController.getstateCode)
module.exports = router;
