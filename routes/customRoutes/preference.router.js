const express = require('express');
const preferenceController =require('../../controllers/customApi/userPreference.controller.js');

const router = express.Router();
const controller = new preferenceController();

router.post('/addPreference', controller.addPreference.bind(controller));
router.post('/updatePreference', controller.updatePreference.bind(controller));
router.get('/listPreference', controller.listPreference.bind(controller));

module.exports = router;
