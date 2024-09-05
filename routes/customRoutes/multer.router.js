// routes/uploadRoutes.js
const express = require('express');
const multerClass = require('../../controllers/customApi/multer.controller.js');

const router = express.Router();

// Handle file upload
router.post('/', multerClass.multerUpload);

module.exports = router;
