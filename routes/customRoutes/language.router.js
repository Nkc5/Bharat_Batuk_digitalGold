const express = require('express');
const languageController = require('../../controllers/customApi/language.controller.js');
const router = express.Router();


// const languageController = new languageController1();


router.post('/add', languageController.Language);
router.get('/Get', languageController.getLanguage);


module.exports = router;


