
const mongoose = require('mongoose');

const transferSchema = new mongoose.Schema({

    "channel": String,
    "currencyPair": String,
    "dstCustomerRefNo": String,
    "quantity": String,
    "srcCustomerRefNo": String,
    "transactionDate": String,
    "transactionOrderID": String,
    "message": String, 
    "orderId": String,
    "totalAmount": String,
    "pricePerG":  String,
    "remainingBalance": String,
    "executionDateTime": String
})

const transferModel = mongoose.model('transfer', transferSchema);

module.exports = transferModel;