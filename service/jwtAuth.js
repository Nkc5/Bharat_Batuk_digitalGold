
const jwt = require('jsonwebtoken');
const userModel = require('../models/user.models.js')

const secretKey = "Nitish$123@.|"

const createToken = (user) => {
    const payload = {
        "customerRefNo": user._doc._id,
        "name": user._doc.name,
        
    };
    // console.log("payload", payload);

    const token = jwt.sign(payload, secretKey)
    return token;   // return token
}

const getUser = async (res, token) => {
    if (!token) { return res.json("Unauthorized, as no token") }
    // const user = jwt.verify(token, secretKey)
    const user = await userModel.findOne({"jwt_token": token})
    // console.log("user", user);

    if(!user){ return res.json("Unauthorized, as invalid token") }
    return user;   
}




module.exports = {
    createToken,
    getUser

}