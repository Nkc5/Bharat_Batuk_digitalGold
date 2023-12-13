const express = require('express');
const NomineeController = require('../../controllers/customApi/userNominee.controller.js');
const router = express.Router();


const nomineeController = new NomineeController();


router.post('/add', (req, res) => nomineeController.addNominee(req, res));
router.patch('/update', (req, res) => nomineeController.updateNominee(req, res));

router.get('/listNominee', (req, res) => nomineeController.listNominee(req, res));
//router.get('/listNominee/:objectId?', (req, res) => nomineeController.listNominee(req, res));

module.exports = router;


