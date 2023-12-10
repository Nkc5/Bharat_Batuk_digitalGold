const express = require('express');
const preferenceController =require('../../controllers/customApi/user.preference.js');

const router = express.Router();
const controller = new preferenceController();

router.post('/addPreference', controller.addPreference.bind(controller));
router.put('/updatePreference', controller.updatePreference.bind(controller));
router.get('/listPreference/:id', controller.listPreference.bind(controller));

module.exports = router;
