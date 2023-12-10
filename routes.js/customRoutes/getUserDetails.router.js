const express = require('express');
const GetUserController = require('../controller/customApi/getUserDetails')


const router = express.Router();
const getUserController = new GetUserController();

router.get('/:id', (req, res) => getUserController.getUserDetails(req, res));

module.exports = router;