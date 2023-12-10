
const mongoose = require('mongoose');

const buyReqSchema = new mongoose.Schema({

    "customerRefNo": String,
    "currencyPair": String,
    "value": String,
    "type": String,
    "calculationType": String,
    "transactionRefNo": String,
    "preTaxAmount": String,
    "quantity": String,
    "quoteId": String,
    "tax1Amt": String,
    "tax2Amt": String,
    "transactionDate": String,
    "transactionOrderID": String,
    "totalAmount": String,
    "billingAddressId": String,
    
})

const buyReqModel = mongoose.model('mmtc_buy_request', buyReqSchema);

module.exports = buyReqModel;