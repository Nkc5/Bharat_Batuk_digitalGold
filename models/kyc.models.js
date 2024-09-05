const mongoose = require('mongoose');

const kycSchema = new mongoose.Schema({

    "customerRefNo": {
        type: String,
    },

    //pan details

    "name": String,
    "pan_no": String,
    "panUrl": {
        type: String,
    },

    /*
    "aadhaar_linked":Boolean,
     "city":String,
     "full": String,
      "line_1":String,
      "line_2": String,
      "state": String,
      "street_name": String,
      "zip": String
    
    "category": String,
    "client_id": String,
    "dob": String,
    "dob_check": Boolean,
    "dob_verified": Boolean,
    "email": String,
    "full_name": String,


        "full_name_split": {
            type:Array
        }
      

        




    */

    // adhar details
    "adhar_no": String,


    //bank details

    "account_no": String,
    "ifsc": String,
    "bank_name": String,
    "branch_name": String




}, { timestamps: true })



const kycModel = mongoose.model('kyc', kycSchema)


module.exports = kycModel;