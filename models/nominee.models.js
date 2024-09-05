const mongoose = require('mongoose');

const nomineeSchema = new mongoose.Schema({

    
    name: {
        type: String,
        required: true
    },
    customerRefNo: String,
    
    phone: {
        type: String,
        required: true

    },
    dob: {
        type: String,
        required: true

    },
    relation : {
        type: String,
        required: true

    },
    is_phone_verified: {
        type: Number,
        default: 1
    },
   
    email: {
        type: String,
        required: true
    },
    is_email_verified : {
        type: Number,
        default: 1

    },
    is_deleted: {
        type: Number,
        default: 0
    },
    deletedAt:{
        type: Date,
        default: null
    }
    

}, {timestamps: true})

const nomineeModel = mongoose.model('nominee',nomineeSchema) 


module.exports = nomineeModel;
