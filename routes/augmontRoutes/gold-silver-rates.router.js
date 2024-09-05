const express = require('express')
const router = express.Router()


const { rates } = require('../../controllers/augmont_api/gold-silver-rates.controller.js')



router.get('/goldRates', rates)

module.exports = router

