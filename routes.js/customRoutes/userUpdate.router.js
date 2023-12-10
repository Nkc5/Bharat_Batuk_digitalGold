
const express = require('express');
const UpdateProfileController = require('../../controllers/customApi/user.updateProfile.js');

const router = express.Router();


router.post('/update', UpdateProfileController.updateProfile);



module.exports = router;