//const connection = require("../../connection"); // mongoose connection
const userModel = require("../../models/user.models.js");
const deviceModel = require("../../models/device.models.js");
const nomineeModel = require("../../models/nominee.models.js");
const addressModel = require("../../models/address.models.js");
const referralModel = require("../../models/referral.models.js");
const { createToken } = require('../../utils/jwtAuth.js');
const NodeMailer = require('./nodeMailer.controller.js');
const SmsApiClient = require("./smsApiClient.js");
const validator = require('validator');
const { v4: uuidv4 } = require('uuid');



let logoutuser;

class UserController {



  static async registerUser(req, res) {

    // creating instance: since static
    const userController = new UserController();
    const { phone, otp, language, referralCode, ...deviceInfo } = req.body;
    const data = req.body;

    try {
      //existing phone no.
      var existUsers = await userModel.findOne({ phone });

      /* ----       login       -------       */


      if (existUsers) {

        var { existUsers, device } = await userController.exitingUser(phone, otp, language, data, existUsers)

        return res.status(200).json({
          error: false,
          message: "Login successful",
          data: [existUsers, device]

        })
      }

      /*  --------  register -----      */

      const user = await userModel.create({ phone, otp, language });
      if (user) {
        // create token
        const token = createToken(user);
        user.jwt_token = token;
        await user.save();

        /* referral code   */

        const { newReferral } = await userController.referralCodeCreate(user, referralCode)

        const custRefNo = user._id.toString();
        const device = await deviceModel.create({ ...data, custRefNo })

        return res.status(200).json({
          error: false,
          message: "User registered successfully",
          data: [user, device]
        })
      }
      else {
        return res.status(500).json({
          error: true,
          message: "Something went wrong",
          data: []
        })
      }

    }
    catch (error) {
      console.log("error", error)
      return res.status(400).json({
        error: true,
        message: error,
        data: []
      })
    }


  }



  async exitingUser(phone, otp, language, data, existUsers) {

    existUsers.otp = otp;
    existUsers.language = language;
    // create token
    const token = createToken(existUsers);
    // save token 
    existUsers.jwt_token = token;

    await existUsers.save();

    const custRefNo = existUsers._id.toString();

    const device = await deviceModel.create({ ...data, custRefNo })

    return { existUsers, device }

  }


  generateOTP() {
    const otp = Math.floor(100000 + Math.random() * 900000);
    return otp.toString();
  }



  static async sendOTP(req, res) {

    const { phone } = req.body;

    // var phone = "8076340855"
    const user = await userModel.findOne({ phone });

    const userController = new UserController();
    const otp = userController.generateOTP();

    if (!user) {
      var newMessage = `
      Your one-time password (OTP) to register on BATUK is ${otp}. Please DO NOT SHARE IT with anyone else. BHARAT BATUK PVT LTD.`
      var newtemplateId = process.env.templateIdRegister;
      var newPhone = phone;
    }
    else {
      var newMessage = `Your one-time password (OTP) to login to BATUK is ${otp}. Please DO NOT SHARE IT with anyone else. BHARAT BATUK PVT LTD.`
      var newtemplateId = process.env.templateIdLogin;
      var newPhone = user.phone;

    }


    const smsApiClient = new SmsApiClient(process.env.otp_base_url);

    // Replace the following values with your actual credentials
    const userId = process.env.userId;
    const password = process.env.password;
    const senderId = process.env.senderId;
    // const phoneNumber = phone;
    const phoneNumber = newPhone;
    const message = newMessage;
    const entityId = process.env.entityId;
    const templateId = newtemplateId;

    const data = {
      userId,
      password,
      senderId,
      phoneNumber,
      message,
      entityId,
      templateId
    }

    console.log("data", data);


    smsApiClient.sendSingleSms(userId, password, senderId, phoneNumber, message, entityId, templateId)
      .then((response) => {
        const result = JSON.parse(response);
        console.log(result);
        result.otp = otp
        return res.json({
          error: false,
          message: "OTP sent successfuly",
          data: [result]
        });

      })
      .catch((error) => {
        console.error(error);
        return res.json({
          error: true,
          message: error,
          data: []
        });
      })





  }




  generateRandomWord() {
    var characters = 'abcdefghijklmnopqrstuvwxyz';
    var randomWord = '';

    for (var i = 0; i < 3; i++) {
      var randomIndex = Math.floor(Math.random() * characters.length);
      randomWord += characters[randomIndex];
    }
    return randomWord;
  }


  //create & get referral code
  async referralCodeCreate(user, referralCode = "") {

    //create new referral code

    const newCustomeRefNo = user._id.toString();
    const referralUUID = this.generateRandomWord() + user.phone.substring(7)

    const newReferral = await referralModel.create({
      customerRefNo: newCustomeRefNo,
      referralCode: referralUUID
    })

    console.log("newReferral", newReferral)

    //  check referred by someone  
    if (referralCode) {
      newReferral.referredBy = referralCode;
      await newReferral.save();
      console.log("newReferral after", newReferral)

      var referralDB = await referralModel.findOneAndUpdate({ referralCode },
        { $inc: { count: 1 } },
        { new: true })

      console.log("referred by in registration", referralDB)

    }

    return { newReferral };

  }



  // Register User

  // static async registerUser(req, res) {

  //   try {

  //     // taking name, phone, email, dob  from registration form
  //     const { name, phone, email, dob, gender, referralCode} = req.body;

  //     console.log("req.body", req.body);


  //     /*   is empty validation  */

  //     // name validation
  //     if (!name) {
  //       console.log("name must not empty")

  //       return res.status(400).json({
  //         error: true,
  //         message: "name is mandatory",
  //         data: []
  //       });
  //     }

  //     // phone validation
  //     if (!phone) {
  //       console.log("phone must not empty")

  //       return res.status(400).json({
  //         error: true,
  //         message: "phone is mandatory",
  //         data: []
  //       });
  //     }

  //     // email validation
  //     if (!email) {
  //       console.log("email must not empty")

  //       return res.status(400).json({
  //         error: true,
  //         message: "email is mandatory",
  //         data: []
  //       });
  //     }

  //     // dob validation
  //     if (!dob) {
  //       console.log("dob must not empty")

  //       return res.status(400).json({
  //         error: true,
  //         message: "dob is mandatory",
  //         data: []
  //       });
  //     }

  //      // gender validation
  //      if (!gender) {
  //       console.log("gender must not empty")

  //       return res.status(400).json({
  //         error: true,
  //         message: "gender is mandatory",
  //         data: []
  //       });
  //     }

  //     /*   is string validation  */



  //     // name validation
  //     if (typeof name !== "string") {
  //       console.log("name must be a string")
  //       return res.status(400).json({
  //         error: true,
  //         message: "name must be a string",
  //         data: []
  //       });
  //     }

  //     // phone validation
  //     if (typeof phone !== "string") {
  //       console.log("phone must be a string")

  //       return res.status(400).json({
  //         error: true,
  //         message: "phone must be a string",
  //         data: []
  //       });
  //     }

  //     // email validation
  //     if (typeof email !== "string") {
  //       console.log("email must be a string");

  //       return res.status(400).json({
  //         error: true,
  //         message: "email must be a string",
  //         data: []
  //       });
  //     }

  //     // dob validation
  //     if (typeof dob !== "string") {
  //       console.log("dob must be a string");

  //       return res.status(400).json({
  //         error: true,
  //         message: "dob must be a string",
  //         data: []
  //       });
  //     }
  //     // gender validation
  //     if (typeof gender !== "string") {
  //       console.log("gender must be a string");

  //       return res.status(400).json({
  //         error: true,
  //         message: "gender must be a string",
  //         data: []
  //       });
  //     }




  //     // existing phone validation
  //     const existingPhone = await userModel.findOne( { phone });
  //     if (existingPhone) {
  //       console.log("phone number already exists")

  //       return res.status(400).json({
  //         error: true,
  //         message: "phone number already exists",
  //         data: []
  //       });
  //     }

  //     // existing email validation

  //     const existingEmail = await userModel.findOne({ email });
  //     if (existingEmail) {
  //       console.log("email already exists")

  //       return res.status(400).json({
  //         error: true,
  //         message: "email already exists",
  //         data: []
  //       });
  //     }



  //     /*

  //     // to calculate age
  //     if (dob) {
  //       let dobParts = dob.split("-");
  //       let reversedDob = dobParts.reverse().join("-");
  //       const dobDate = new Date(reversedDob);
  //       const currentDate = new Date();
  //       const age = currentDate.getFullYear() - dobDate.getFullYear();
  //       console.log("Calculated age:", age);  // Add this line
  //       if (age < 18) {
  //         return res.status(400).json({
  //           error: true,
  //           message: "User must be at least 18 years old"  ,
  //           data: []
  //         });
  //       }
  //     }

  //     */




  //     // Mobile length validation 
  //     if (phone.length !== 10) {
  //       return res.status(400).json({
  //         error: true,
  //         message: "Mobile number must be 10 digits",
  //         data: []
  //       });
  //     }



  //     if (!validator.isEmail(email)) {
  //       return res.status(400).json({
  //         error: true,
  //         message: "Email is not valid.",
  //         data: [],
  //       });
  //     }

  //     // Create/insert user in database
  //     const newUser = await userModel.create({
  //       name,
  //       phone,
  //       email,
  //       dob,
  //       gender
  //     });


  //     // console.log(newUser)

  //     // create token
  //     const token = createToken(newUser);

  //     // save token 
  //     newUser.jwt_token = token;
  //     await newUser.save();

  //     // last login
  //     newUser.last_login = new Date();
  //     await newUser.save();


  //     // Update user with an auto-incremented ID
  //     // const userCount = await userModel.countDocuments();
  //     // const customerRefNo = newUser._id;

  //     // const increUser = await userModel.findOneAndUpdate({ "_id": customerRefNo }, { "id": userCount })
  //     //  console.log("increUser.id", increUser.id)


  //     // console user
  //     console.log(newUser);



  //     /* referral code   */

  //     //create referral code
  //     const newCustomeRefNo=newUser._id.toString();
  //     // const referralUUID = uuidv4().substring(0,8);
  //     const referralUUID = newUser.name.substring(0,3)+ newUser.phone.substring(7)
  //     const newReferral = await referralModel.create({
  //       customerRefNo: newCustomeRefNo, 
  //       referralCode: referralUUID
  //     })

  //     console.log("newReferral", newReferral)

  //     // check referral code 
  //     if(referralCode){
  //       newReferral.referredBy = referralCode;
  //       await newReferral.save();
  //       console.log("newReferral after", newReferral)

  //       var referralDB = await referralModel.findOneAndUpdate({referralCode}, 
  //         { $inc: { count: 1 } },  // Update operation (increment count by 1)
  //         {new:true})

  //         console.log("referred by in registration", referralDB)
  //     }


  //     // sending email through nodemailer;
  //     await NodeMailer.toSendEmail(req, res, "register", newUser, null);



  //     const userDisplay = newUser.toObject();

  //     userDisplay.isKycDone = false;
  //     userDisplay.isNomineeAdded = false;
  //     userDisplay.hasBillingaddress_id = false;
  //     userDisplay.referralCode = newReferral.referralCode;

  //     res.status(200).json({
  //       error: false,
  //       message: "User registered successfully",
  //       data: [userDisplay]
  //     });

  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).json({
  //       error: true,
  //       message: error,
  //       data: []
  //     });
  //   }
  // }









  //login
  static async loginUser(req, res) {
    const { phone } = req.body;  // for app


    if (phone.length != 10) {
      console.log("Mobile number should be 10 digits")
      return res.status(400).json({
        error: true,
        message: "Mobile number should be 10 digits",
        data: []
      });
    }


    try {

      // finding user with phone from database
      const user = await userModel.findOne({ phone });

      if (!user) {
        return res.status(400).json({
          error: true,
          message: "User not found!, Please Register",
          data: []
        });
      }

      // is_deleted validation
      if (user.is_deleted !== 0) {
        return res.status(400).json({
          error: true,
          message: "Account deleted!, create a new account",
          data: []
        });

      }

      // account_status validation
      if (user.account_status !== 1) {
        return res.status(400).json({
          error: true,
          message: "Blocked!, you are not allowed",
          data: []
        });

      }


      // create token
      const token = createToken(user);

      // save token 
      user.jwt_token = token;
      // await user.save();

      // last login
      user.last_login = new Date();
      await user.save();


      // checking for kyc
      const kycUser = user.kyc_status
      console.log("kycUser", kycUser)

      // checking for nominee
      const nomineeUser = await nomineeModel.findOne({ "customerRefNo": user._id });
      console.log("nomineeUser", nomineeUser);

      // checking for Billingaddress
      const billAddressUser = await addressModel.findOne({ "customerRefNo": user._id, "type": "B", "is_deleted": 0 });


      const userDisplay = user.toObject();

      userDisplay.isKycDone = kycUser ? true : false;
      userDisplay.isNomineeAdded = nomineeUser ? true : false;
      userDisplay.hasBillingaddress_id = billAddressUser ? true : false;



      return res.json({
        error: false,
        message: "Successfully login",
        data: [userDisplay]
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


  // static tokenForLogoutFuntion() {
  //   return logoutuser;
  // }





  // Logout User
  static async logoutUser(req, res) {

    const user = req.user;
    if (!user) {
      return res.status(400).json({
        error: false,
        message: "Already Logout!, please login",
        data: []

      });
    }

    // console user
    console.log("req.user", user);

    const customerRefNo = user._id;


    // delete token from database with customerRefNo
    const findUser = await userModel.findOne({ _id: customerRefNo });
    findUser.jwt_token = null;
    findUser.save()

    return res.json({
      error: false,
      message: "Successfully logout",
      data: []

    });

  } catch(err) {
    console.log(err);
    return res.status(400).json({
      error: true,
      message: err,
      data: []
    });
  }




}






module.exports = UserController;
