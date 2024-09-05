const userMMtc = require('../mmtcApi/user.controller.js')
const userModel = require('../../models/user.models.js');
const addressModel = require('../../models/address.models.js');
const cityModel = require("../../models/city.models.js");
const stateModel = require("../../models/state.models.js");
const validator = require('validator');
const dotenv = require('dotenv')

dotenv.config();

/*

must required for mmtc update profile:


{
    "fullName": "11111",
    "customerRefNo": "12345",
    "kycStatus": "I",
    "mobileNumber": "9999999945",
    "partner_id": "bharat_batuk",
    "billingAddress": {
         "id": "JoaPigO8rkiWuWfDxaR1F",
        "line1": "",
        "line2": "",
        "city": "",
        "state": "",
        "zip": 301301,
        "country": "",
        "mobileNumber": "",
        "statecode": "10"
    },
    "deliveryAddress": {
        "id": "g2xoY-HfQOm74xKhNPIXL",
        "line1": "",
        "line2": "",
        "city": "",
        "state": "",
        "zip": 401301,
        "country": "",
        "mobileNumber": "",
        "statecode": "10"
    }
}

*/




/*
 _id: ObjectId("657d5eb814dd3f1221fae1c6"),
    name: 'Karnataka',
    country_id: '657d5b3824cae0886de38353',
    status: 1,
    state_code: 29,
    iso_code: 'KA',
    __v: 0



     _id: ObjectId("659baf7e1c008d3d6615f19e"),
    city_name: 'Bapatla',
    country_id: '657d5b3824cae0886de38353',
    state_id: '657d5eb814dd3f1221fae1b7',
    status: 1,
    __v: 0





*/
class UpdateProfileController {

  // name, email, dob, gender, city
  //cant change phone number


  static async updateProfile(req, res) {


    try {
      const customerRefNo = req.user._id;
      const partnerId = process.env.partner_id;
    

      var userDB= await userModel.findOne({_id: customerRefNo});
      const mmtcCustRef = userDB.mmtc_customer_ref;
      const KYCStatus = userDB.kyc_status;
      const mobileNumber = userDB.phone;
      const pan = userDB.pan_number;

     console.log("mmtcCustRef", mmtcCustRef)

      if( KYCStatus === 0){
       var kycStatus = "I" 
        var kycInfo= {}
      }
      else if( KYCStatus === 1){
       var kycStatus = "Y"
        var kycInfo= {
          nameProofType: "pan",
          nameProofDocNo: pan
      }
      }


      var { fullName, emailAddress, dob, gender, city } = req.body;


      // let stateID = _id;

      console.log("req.body", req.body)

      /* isString & isEmpty validation     */


      // if (typeof stateID !== "string") {
      //   return res.status(400).json({
      //     "error": true,
      //     "message": "_id must be string",
      //     "data": []
      //   })
      // }




      if (typeof fullName !== "string") {
        return res.status(400).json({
          "error": true,
          "message": "fullName must be string",
          "data": []
        })
      }

      if (typeof emailAddress !== "string") {
        return res.status(400).json({
          "error": true,
          "message": "emailAddress must be string",
          "data": []
        })
      }

      if (typeof dob !== "string") {
        return res.status(400).json({
          "error": true,
          "message": "dob must be string",
          "data": []
        })
      }

      if (typeof gender !== "string") {
        return res.status(400).json({
          "error": true,
          "message": "gender must be string",
          "data": []
        })
      }


      // if (typeof city !== "string") {
      //   return res.status(400).json({
      //     "error": true,
      //     "message": "city must be string",
      //     "data": []
      //   })
      // }


      if (validator.isEmpty(fullName)) {
        return res.status(400).json({
          "error": true,
          "message": "fullName should not be empty",
          "data": []
        })
      }
      if (validator.isEmpty(emailAddress)) {
        return res.status(400).json({
          "error": true,
          "message": "emailAddress should not be empty",
          "data": []
        })
      }
      if (validator.isEmpty(dob)) {
        return res.status(400).json({
          "error": true,
          "message": "dob should not be empty",
          "data": []
        })
      }
      if (validator.isEmpty(gender)) {
        return res.status(400).json({
          "error": true,
          "message": "gender should not be empty",
          "data": []
        })
      }
      // if (validator.isEmpty(city)) {
      //   return res.status(400).json({
      //     "error": true,
      //     "message": "city should not be empty",
      //     "data": []
      //   })
      // }

      
      // if (validator.isEmpty(stateID)) {
      //   return res.status(400).json({
      //     "error": true,
      //     "message": "_id should not be empty",
      //     "data": []
      //   })
      // }



      if (!validator.isEmail(emailAddress)) {
        return res.status(400).json({
          error: true,
          message: "Email is not valid.",
          data: [null],
        });
      }

   
      console.log("dob", dob);
      

      // const stateDB = await stateModel.findOne({_id: stateID})
      // if(stateDB){
      //   userDB.state = stateDB.name;
      //   await userDB.save();
      // }
    
      if (mmtcCustRef) {
        /*customerRefNo, fullName, mobileNumber, kycStatus, partner_id, billing & delievery address id, zip & statecode is must */

        // calling get user details (mmtc: to get address id)
        const getUserDetails = await userMMtc.getProfile({ customerRefNo, mobileNumber }, res);
        const deliveryAddressID = getUserDetails.deliveryAddress[0].id;
        const billingAddressID = getUserDetails.billingAddress[0].id;

        const newDOB = dob.split('-').reverse().join('-');
        console.log("newDob", newDOB)
        console.log("deliveryAddressID", deliveryAddressID)

        const updatedUserData = {
          customerRefNo, fullName, mobileNumber,emailAddress,dob, "partner_id": partnerId, kycStatus, kycInfo,
          "deliveryAddress": { "id": deliveryAddressID, "zip": 201301, "statecode": "09" },
          "billingAddress": { "id": billingAddressID, "zip": 201301, "statecode": "09" },
        };


        const response = await userMMtc.updateProfile(updatedUserData, res)

        console.log("response", response)

        if (response == "updated successfully.") {

          const updatedUser = await userModel.findOneAndUpdate({ "_id": customerRefNo }, { name: fullName, email: emailAddress, dob, gender, city }, { new: true });

          const updatedUserObj = updatedUser.toObject();

          console.log("updatedUser", updatedUser)

          if (updatedUser) {
            return res.json({
              error: false,
              message: response,
              data: [updatedUserObj]
            });
          }

          else {
            return res.json({
              error: true,
              message: "Failed to update, Something went wrong!",
              data: []
            });
          }


        }

      }

      else {

        const updatedUser = await userModel.findOneAndUpdate({ "_id": customerRefNo }, {
          name: fullName,
          email: emailAddress,
          dob: dob,
          city,
          gender: gender
        }, { new: true });

        // console.log("updatedUser", updatedUser)

        const updatedUserObj = updatedUser.toObject();

        console.log("updatedUserObj", updatedUserObj)


        if (updatedUser) {
          return res.json({
            error: false,
            message: "Profile Updated Successfully",
            data: [updatedUserObj]
          });
        }

        else {
          return res.json({
            error: true,
            message: "Failed to update, Something went wrong!",
            data: []
          });
        }
      }

    } catch (error) {
      console.log(error)
      const errorMessage = JSON.parse(error.message);
      const errorReason = errorMessage.reason;
      const errorCode = errorMessage.code;

      return res.json({
        "error": true,
        "message": errorReason,
        "data": [],
        "code": errorCode
      })
    }
  }
}


module.exports = UpdateProfileController;
