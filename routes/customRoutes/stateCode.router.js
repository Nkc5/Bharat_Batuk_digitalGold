const express = require('express');
const StateCodeController = require('../../controllers/customApi/stateCode.controller.js');
const router = express.Router();

router.get('/getstateCode',StateCodeController.getstateCode)
router.get('/getcity',StateCodeController.getcity)
router.post('/getCitiesOfState',StateCodeController.getCitiesOfState)
// router.post('/countryCodes',StateCodeController.insertCountryCodes)
// router.post('/stateCodes',StateCodeController.insertstateCodes)
//router.post('/cityCodes',StateCodeController.insertcityCodes)


console.log("state route hit")
module.exports = router;
