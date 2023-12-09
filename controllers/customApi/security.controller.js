//const connection = require("../../connection"); // mongoose connection
const userModel = require("../../models/user.models.js");
const { createToken } = require('../../service/jwtAuth.js');
// const { createProfile } = require("../mmtcApi/user.controller.js");
//const { reqUser } = require("../../middlewares/authMiddleware");
const validator = require('validator');


let logoutuser;

class UserController {

  // Register User
  static async registerUser(req, res) {

    try {

      // taking name, phone, email, dob  from registration form
      const { name, phone, email, dob } = req.body;

      // console.log("req.body", req.body);


      /*   is empty validation  */

      // name validation
      if (!name) {
        return res.status(400).json({
          error: true,
          message: "name is mandatory",
          data: []
        });
      }

      // phone validation
      if (!phone) {
        return res.status(400).json({
          error: true,
          message: "phone is mandatory",
          data: []
        });
      }

      // email validation
      if (!email) {
        return res.status(400).json({
          error: true,
          message: "email is mandatory",
          data: []
        });
      }

      // dob validation
      if (!dob) {
        return res.status(400).json({
          error: true,
          message: "dob is mandatory",
          data: []
        });
      }


      /*   is string validation  */



      // name validation
      if (typeof name !== "string"){
        return res.status(400).json({
          error: true,
          message: "name must be a string" ,
          data: []
        });
      }

      // phone validation
      if (typeof phone !== "string") {
          return res.status(400).json({
            error: true,
            message: "phone must be a string" ,
            data: []
          });
      }

      // email validation
      if (typeof email !== "string") {
        return res.status(400).json({
          error: true,
          message: "email must be a string" ,
          data: []
        });
      }

      // dob validation
      if (typeof dob !== "string") {
        return res.status(400).json({
          error: true,
          message: "dob must be a string" ,
          data: []
        });
      }



      // existing user validation
      const existingUser = await userModel.findOne({ $or: [{ email }, { phone }] });
      if (existingUser) {
        return res.status(400).json({
          error: true,
          message: "User already exists" ,
          data: []
        });
      }



      // to calculate age
      if (dob) {
        let dobParts = dob.split("-");
        let reversedDob = dobParts.reverse().join("-");
        const dobDate = new Date(reversedDob);
        const currentDate = new Date();
        const age = currentDate.getFullYear() - dobDate.getFullYear();
        console.log("Calculated age:", age);  // Add this line
        if (age < 18) {
          return res.status(400).json({
            error: true,
            message: "User must be at least 18 years old"  ,
            data: []
          });
        }
      }



      // Mobile length validation 
      if (phone.length !== 10) {
        return res.status(400).json({
          error: true,
          message: "Mobile number must be 10 digits"  ,
          data: []
        });
      }



      if (!validator.isEmail(email)) {
        return res.status(400).json({
          error: true,
          message: "Email is not valid.",
          data: [],
        });
      }

      // Create/insert user in database
      const newUser = await userModel.create({
        name,
        phone,
        email,
        dob
      });


      // console.log(newUser)

      // create token
      const token = createToken(newUser);

      // save token 
      newUser.jwt_token = token;
      await newUser.save();

      // last login
      newUser.last_login = new Date();
      await newUser.save();

      // console.log(user)

      logoutuser = newUser;



      // Update user with an auto-incremented ID
      const userCount = await userModel.countDocuments();
      const customerRefNo = newUser._id;

      const increUser = await userModel.findOneAndUpdate({ "_id": customerRefNo }, { "id": userCount })
      //  console.log("increUser.id", increUser.id)


      // console user
      console.log(newUser)

      res.status(200).json({
        error: false,
        message: "User registered successfully",
        data: [newUser]
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: true,
        message: error,
        data: []
      });
    }
  }



  // Login User
  static async loginUser(req, res) {
    const { phone } = req.body;  // for app



    try {

      // finding user with phone from database
      const user = await userModel.findOne({ phone });

      if (!user) {
        return res.status(400).json({
          error: true,
          message: "user not found" ,
          data: []
        });
      }

      // is_deleted validation
      if (user.is_deleted !== 0) {
        return res.status(400).json({
          error: true,
          message:"Account deleted!, create a new account" ,
          data: []
        });

      }

      // account_status validation
      if (user.account_status !== 1) {
        return res.status(400).json({
          error: true,
          message:"Blocked!, you are not allowed" ,
          data: []
        });

      }


      // create token
      const token = createToken(user);

      // save token 
      user.jwt_token = token;
      await user.save();

      // last login
      user.last_login = new Date();
      await user.save();

      // console.log(user)

      logoutuser = user;


      return res.json({
        error: false,
        message: "Successfully login",
        data: [user]
      });

    } catch (err) {
      console.log(err);
      return res.json({
        error: true,
        message: err,
        data: []
      });
    }
  }


  static tokenForLogoutFuntion() {
    return logoutuser;
  }


}






module.exports = UserController;
