const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    "id": {
        type: Number,
    },

    "imageUrl": {
        type: String,
    },
    "panUrl": {
        type: String,
    },
    "adharUrl": {
        type: String,
    },
    "adharBackUrl": {
        type: String,
    },
    "mmtc_customer_ref": {
        type: String,
        default: null
    },
    "uniqueId": {
        type: String,
        default: null
    },
    "name": {
        type: String,
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
    },
    "is_email_verified": {
        type: Number,
        default: 1
    },
    "country": {
        type: String,
        default: "Bharat"
    },
    "state": {
        type: String,
        default: null
    },
    "city": {
        type: String,
        default: null
    },
    "dob": {
        type: String,
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
    otp: String,
    language: String


}, { timestamps: true })



const userModel = mongoose.model('users', userSchema)


module.exports = userModel;