
const express = require('express');
const router = express.Router();
const userActive = require('../../controllers/customApi/userActive.controller.js'); 



router.post('/active',userActive.activeuser);
router.post('/inactive',userActive.inactiveuser);
router.post('/validate',userActive.validateUser);
router.post('/invalidate',userActive.invalidateUser);
router.post('/getport',userActive.gosport);
router.post('/pin',userActive.isPin);

module.exports = router;
