const userMMtc = require('../mmtcApi/user.controller.js')
const userModel = require('../../models/user.models.js');
const addressModel = require('../../models/address.models.js')
const billAddressModel = require('../../models/billAddress.models.js')
const validator = require('validator');
const dotenv = require('dotenv')

dotenv.config();

/*

must required for update:


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



class UpdateProfileController {

  // name, email, dob, gender, city

  static async updateProfile(req, res) {
    
    
    try {
      const customerRefNo = req.user._id;
      const partnerId = process.env.partner_id;
      let fullName, emailAddress, dob, gender, city

      const mobileNumber = req.user.phone;
      const KYCStatus = req.user.kyc_status;


      let kycStatus

      if (KYCStatus === 0) {
        kycStatus = "I";
      }

      else if (KYCStatus === 1) {
        kycStatus = "Y";
      }


      const mmtcCustRef = req.user.mmtc_customer_ref;
      console.log("mmtcCustRef", mmtcCustRef);

      ({ fullName, emailAddress, dob, gender, city } = req.body);

      if (!fullName) {
        fullName = req.user.name;
      }

      if (!emailAddress) {
        emailAddress = req.user.email;
      }

      if (!dob) {
        dob = req.user.dob;
      }

      if (!gender) {
        gender = null;
      }

      if (!city) {
        city = 0;
      }


      // if (mmtcCustRef) {

      //   // customerRefNo , billing & delievery address id, zip & statecode{zip & statecode must be same provided in create profile} is must

      //   // find delievery address id
      //   const deliveryAddress = await addressModel.findOne({ "usercustomerRefNo": customerRefNo });
      //   // console.log(deliveryAddress)

      //   // find billing address id
      //   const billingAddress = await billAddressModel.findOne({ "usercustomerRefNo": customerRefNo });
      //   // console.log(billingAddress);



      //   const updatedUserData = {
      //     customerRefNo, fullName, mobileNumber, "partner_id": partnerId, kycStatus,
      //     "deliveryAddress": { "id": deliveryAddress.id, "zip": 201301, "statecode": "09" },
      //     "billingAddress": { "id": billingAddress.id, "zip": 201301, "statecode": "09" },
      //   };

      //   console.log("updatedUserData", updatedUserData);

      //   const response = await userMMtc.updateProfile(updatedUserData, res)

      //   if (response == "updated successfully.") {

      //     const updatedUser = await userModel.findOneAndUpdate({ "_id": customerRefNo }, { "name": fullName, "email": emailAddress, "dob": dob, gender }, { new: true });
      //     return res.json({
      //       error: false,
      //       message: response,
      //       data: [updatedUser]
      //     });
      //   }

      // }

      // else {
        const updatedUser = await userModel.findOneAndUpdate({ "_id": customerRefNo }, {
          "name": fullName,
          "email": emailAddress,
          "dob": dob,
          "city": city
        }, { new: true });

        return res.json({
          error: false,
          message: "Profile Updated Successfully",
          data: [updatedUser]
        });

      // }

    } catch (err) {
      console.error('Error:', err);
      return res.json({
        error: true,
        message: err.message,
        data: null
      });
    }
  }
}


module.exports = UpdateProfileController;
