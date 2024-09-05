
const mongoose = require('mongoose');


const referralSchema = new mongoose.Schema({

    customerRefNo: String,
    referralCode: String,
    referredBy: {
        type: String,
        default: null
    },
    count: {
        type: Number,
        default: 0
    }
})

const referralModel = mongoose.model('referral', referralSchema);


module.exports = referralModel;