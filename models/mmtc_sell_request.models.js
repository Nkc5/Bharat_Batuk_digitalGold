
const mongoose = require('mongoose');

const sellReqSchema = new mongoose.Schema({

    "customerRefNo": String,
    "currencyPair": String,
    "transactionRefNo": String,
    "value": String,
    "type": String,
    "calculationType": String,
    "payOut": Object,
    "paymentChannel": String,
    "preTaxAmount": String,
    "quantity": String,
    "quoteId": String,
    "tax1Amt": String,
    "tax2Amt": String,
    "transactionDate": String,
    "transactionOrderID": String,
    "totalAmount": String,
    
})

const sellReqModel = mongoose.model('mmtc_sell_request', sellReqSchema);

module.exports = sellReqModel;