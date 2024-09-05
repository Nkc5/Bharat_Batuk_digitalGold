const express = require('express');
const router = express.Router();

const { productController } = require('../../controllers/augmont_api/product.controller.js');

const controllerInstance = new productController();

router.get('/products', controllerInstance.Products.bind(controllerInstance));
router.get('/show-product/:sku', controllerInstance.showProduct.bind(controllerInstance));

module.exports = router;
