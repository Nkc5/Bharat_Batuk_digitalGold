
const express = require('express');
const addressRouter = express.Router();
const AddressController = require('../../controllers/customApi/userAddress.controller.js'); 


addressRouter.post('/addaddress', AddressController.addAddress.bind(AddressController));
addressRouter.get('/get_address', AddressController.get_address);
addressRouter.post('/updateAddress', AddressController.updateAddress.bind(AddressController));

addressRouter.post('/delete', AddressController.deleteAddress.bind(AddressController));
module.exports = addressRouter;

