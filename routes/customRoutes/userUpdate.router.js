
const express = require('express');
const UpdateProfileController = require('../../controllers/customApi/userUpdateProfile.controller.js');

const router = express.Router();


router.post('/update', UpdateProfileController.updateProfile);



module.exports = router;