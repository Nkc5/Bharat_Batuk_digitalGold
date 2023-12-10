const express = require('express');
const PanVerificationController = require('../../controllers/customApi/user.verifyPanNumber.js');
// const NomineeController = require('../../controllers/customApi/user.nominee.js');

const router = express.Router();
// const panVerificationController = new PanVerificationController();

// Define the route for PAN number verification
router.post('/verifyPan', PanVerificationController.verifyPanNumber);

module.exports = router;