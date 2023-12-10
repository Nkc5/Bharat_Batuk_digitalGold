
const mongoose = require('mongoose');

const buyResSchema = new mongoose.Schema({
    
    "customerRefNo": String,
    "customerName": String,
    "currencyPair": String,
    "quantity": String,
    "quoteValidityTime": String,
    "quoteId": String,
    "taxType": String,
    "tax1Amt": String,
    "tax2Amt": String,
    "tax3Amt": String,
    "tax1Perc": String,
    "tax2Perc": String,
    "preTaxAmount": String,
    "taxAmount": String,
    "type": String,
    "createdAt": String,
    "transactionOrderID": String,
    "totalAmount": String,
    "billingAddressId": String,
    "quantity": String,
    "orderId": Object,
    "netAmount" : String,
     "currencyPair": String,
     "executionDateTime": String,
     "pricePerG": String,
     "taxPercent": String,
     "remainingBalance": Array

})


const buyResModel = mongoose.model('mmtc_buy_response', buyResSchema);

module.exports = buyResModel;