const userModel = require('../../models/user.models.js');
const userMMtc = require('../mmtcApi/user.controller')
const nomineeModel = require("../../models/nominee.models.js");
const addressModel = require("../../models/address.models.js");
const cityModel = require("../../models/city.models.js");
const stateModel = require("../../models/state.models.js");
const kycModel = require("../../models/kyc.models.js");
const referralModel = require("../../models/referral.models.js");
const adhar = require("../../models/adhar.models.js");
const pan = require("../../models/pan.models.js");
const bank = require("../../models/bank.models.js");



class GetUserController {


  static async getUserDetails(req, res) {

    try {
      const customerRefNo = req.user._id.toString();
     


      // get profile from database
      const user = await userModel.findOne({ _id: customerRefNo });

      const mobileNumber = user.phone;
      const mmtcCustRef = user.mmtc_customer_ref;

      
      console.log("user", user)
      // checking for kyc
      const kycUser = user.kyc_status

      // checking for nominee
      const nomineeUser = await nomineeModel.findOne({ customerRefNo });
      console.log("nomineeUser", nomineeUser);

      // checking for Billingaddress
      const billAddressUser = await addressModel.findOne({ $and: [{ customerRefNo }, { "type": "B" }, { "is_deleted": 0 }] });

      console.log("billAddressUser", billAddressUser)

      const isKycDone = kycUser ? true : false;
      const isNomineeAdded = (nomineeUser != undefined && nomineeUser != null) ? true : false;
      const hasBillingaddress_id = billAddressUser ? true : false;


      // checking for gender
      var gender = user.gender;
      const city= user.city;
      var state = user.state;

      var stateDB = await stateModel.findOne({name: state});
      if(stateDB){
        var stateID = stateDB._id;
      }
      else{
        var stateID = null;

      }

      

      // getting kyc details
 
      var kycResponse = await kycModel.findOne({customerRefNo})
      console.log("kycResponse", kycResponse)
      
      if(kycResponse){
        var kyc = kycResponse.toObject();  
        kyc.panUrl = user.panUrl   
        kyc.adharUrl = user.adharUrl   
      }
      else{
        var kyc = {
          panUrl: user.panUrl ,
          adharUrl: user.adharUrl 
        };
      }

      const adharResponse = await adhar.findOne({customerRefNo}).sort({_id: -1});
      const panResponse = await pan.findOne({customerRefNo}).sort({_id: -1});
      const bankResponse = await bank.findOne({customerRefNo}).sort({_id: -1});
      console.log("adharResponse",adharResponse)
      console.log("panResponse",panResponse)
      console.log("bankResponse",bankResponse)

      // const adhar=adharResponse.msg.Aadhar_No;
      // const pan=panResponse.msg.PanNumber;

      
      // var Aadhar_No = await userModel.findOneAndUpdate({_id:customerRefNo}, {Aadhar_No:data.msg.Aadhar_No, kyc_status: 1}, {new: true});
      // referral code

      const referralDB = await referralModel.findOne({customerRefNo});

      // get mmtc profile
      if (mmtcCustRef) {
        const response = await userMMtc.getProfile({ customerRefNo, mobileNumber }, res)

        // Extract date and reverse it
        console.log("response", response)


        if(response && response.dob){

          const newDOB = response.dob.split('T')[0];
          const newwss = newDOB.split("-")
          const ggg = newwss[2] + "-" + newwss[1] + "-" + newwss[0]
          console.log("ggg", ggg)
          response.dob = ggg;
          // console.log(ggg)
        }
        else{
          response.dob = user.dob;
        }


        console.log("response data", { ...response, "isKycDone": isKycDone,"Aadhar_No":"Aadhar_No","isNomineeAdded": isNomineeAdded, "hasBillingaddress_id": hasBillingaddress_id, state, city, stateID })

        return res.json({
          "error": false,
          "message": 'User found',
          // "data": [{ ...response, "isKycDone": isKycDone, "isNomineeAdded": isNomineeAdded, "hasBillingaddress_id": hasBillingaddress_id, gender, state, city, stateID, referralCode:referralDB?referralDB.referralCode: null, kyc: {...kyc}  }]
          "data": [{ ...response, "isKycDone": isKycDone, "isNomineeAdded": isNomineeAdded, "hasBillingaddress_id": hasBillingaddress_id, gender, state, city, stateID, referralCode:referralDB?referralDB.referralCode: null, kyc:{adhar_no:adharResponse?adharResponse.msg.Aadhar_No:null,pan_no:panResponse?panResponse.msg.PanNumber:null,account_no:bankResponse?bankResponse.msg.account_no:null} }]
        })
      }


      if (user) {
        const newUser = user.toObject();
        newUser.city = city;

         //adding some properties
         newUser.fullName = newUser.name
         newUser.mobileNumber = newUser.phone
         newUser.emailAddress = newUser.email

         // deleting some properties
         delete newUser.name; 
         delete newUser.phone; 
         delete newUser.email; 

        console.log("newUser", newUser)

        return res.json({
          "error": false,
          "message": 'User found',
          "data": [{ ...newUser, state, "isKycDone": isKycDone, "isNomineeAdded": isNomineeAdded, "hasBillingaddress_id": hasBillingaddress_id, stateID,referralCode:referralDB?referralDB.referralCode:null,  kyc:{adhar_no:adharResponse?adharResponse.msg.Aadhar_No:null,pan_no:panResponse?panResponse.msg.PanNumber:null,account_no:bankResponse?bankResponse.msg.account_no:null}, billAddressUser }]
        })
      } else {
        return res.status(400).json({
          "error": true,
          "message": 'User not found! Please Register',
          "data": []
        })
      }
    } catch (error) {
      const errorMessage = JSON.parse(error.message);
      const errorReason = errorMessage.reason;
      const errorCode = errorMessage.code;

      return res.json({
        "error": true,
        "message": errorReason,
        "data": null,
        "code": errorCode
      })
    }
  }




  




  
  static async getKycDetails(req, res) {
    const customerRefNo = req.user._id.toString();

    var {pan_no} = req.body;
    var data = req.body;


    var user = await userModel.findOne({ _id: customerRefNo });


    try {

      var response = await kycModel.findOne({customerRefNo})

      if(response){
      var updateResponse = await kycModel.findOneAndUpdate({customerRefNo},data, {new:true})
      

      if(user && pan_no){
        user.pan_number = pan_no;
        user.kyc_status = 1;
        await user.save();
      }

      console.log("user", user)
      console.log("updateResponse", updateResponse)


      return res.json({
        "error": false,
        "message": 'kyc details updated',
        "data": [updateResponse]
      })
      }

      else{
        
      if(user && pan_no){
        user.pan_number = pan_no;
        user.kyc_status = 1;
        await user.save();
      }

        var createResponse = await kycModel.create({customerRefNo, ...data})
        
        console.log("user", user)
        console.log("createResponse", createResponse)

        return res.json({
          "error": false,
          "message": 'kyc details updated',
          "data": [createResponse]
        })
      }


      


    } catch (error) {
    console.log(error);
      return res.status(400).json({
        "error": true,
        "message": error,
        "data": null
      })
    }
  }




}

module.exports = GetUserController;
