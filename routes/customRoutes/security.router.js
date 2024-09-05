
const express = require('express');
const UserController = require('../../controllers/customApi/security.controller.js');
const userRoute = express.Router();


userRoute.post('/register',UserController.registerUser); 
userRoute.post('/login', UserController.loginUser); 
userRoute.post('/verification', UserController.sendOTP); 
 


module.exports = userRoute;
