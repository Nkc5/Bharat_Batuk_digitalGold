const express = require('express');
const router = express.Router();

const { postOrder } = require('../../controllers/augmont_api/post_order.controller.js');



router.post('/postorder', postOrder);

module.exports = router;