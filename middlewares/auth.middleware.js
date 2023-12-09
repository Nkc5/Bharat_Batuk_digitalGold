

const {getUser} = require('../service/jwtAuth'); 
const userModel = require('../models/user.models.js')

// let reqUserToken = "";

async function restrictToLoggedInUserOnly(req, res, next){

    const authToken = req.headers.authorization;

    if(!authToken){
        return res.json("No token found!, Please login(navigate to login page)")
    }
    // console.log(authToken);
    const token = authToken.split(' ')[1];
    // console.log(token)
    
    if(!token){ 
        // console.log("No token found!, Please login(navigate to login page)")
        return res.json("No token found!, Please login(navigate to login page)")
    }

    const user = await getUser(res, token);
    if(!user){ 
        // console.log("No user exists in given token!, Please login(navigate to login page)")
        return res.json("No user exists in given token!, Please login(navigate to login page)")
    }
    // console.log("user get from token", user)
    req.user = user;
    reqUserToken = req.user;
    next(); 

}


// function reqUser(){
//     return reqUserToken;
// }

module.exports = {restrictToLoggedInUserOnly};