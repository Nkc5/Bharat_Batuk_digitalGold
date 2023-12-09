const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    "id":{
        type: Number,
    },
//    "password": String,
     
    "mmtc_customer_ref": {
        type: String,
        default: null
    },

    "name": {
        type: String,
        required: true,
        trim: true
    },

    "phone": {
        type: String
    },

    "is_phone_verified": {
        type: Number,
        default: 1,
    },
    "email": {
        type: String,
        required: true,
        unique: true
    },
    "is_email_verified": {
        type: Number,
        default: 1
    },
    "country": {
        type: String,
        default: "Bharat"
    },
    "city": {
        type: Number,
        default: 0
    },
    "dob": {
        type: String,
        required: true,
    },
    "pan_number": {
        type: String,
        default: null
    },
    "kyc_status": {
        type: Number,
        default: 0
    },
    "account_status": {
        type: Number,
        default: 1
    },
    "gender": {
        type: String,
        default: null
    },
    "is_corporate": {
        type: Number,
        default: 0
    },
    "gstin": {
        type: String,
        default: null
    },
    "fcm_token": {
        type: String,
        default: null
    },
    "jwt_token": {
        type: String,
        default: null
    },
    
    "last_login": {
        type: Date,
    },
    "is_deleted": {
        type: Number,
        default: 0
    },
}, {timestamps: true})



const userModel = mongoose.model('users', userSchema)


module.exports = userModel;