const express = require('express');
const GetUserController = require('../../controllers/customApi/userGetUserDetails.controller.js')


const router = express.Router();
// const getUserController = new GetUserController();

router.get('/', (req, res) => GetUserController.getUserDetails(req, res));
router.post('/getKycDetails', GetUserController.getKycDetails);

module.exports = router;