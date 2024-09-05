
const mongoose = require('mongoose');

const buyAndTransferSchema = new mongoose.Schema({

    "buyCustomerRefNo": String,
    "channel": String,
    "currencyPair": String,
    "transactionDate": String,
    "transactionOrderID": String,
    "dstCustomerRefNo": String,
    "transferCustomerRefNo":String,
    "quantity": String,
    "amount": String,
    "message": String, 
    "billingAddressId":  String,
    "transferCustomerBalance": String,
    "orderId": Object,
    "netAmount": String,
    "tax1Amt": String,
    "tax2Amt": String,
    "buyCustomerName": String,
    "transferCustomerName": String,
    "tax1Perc": String,
    "pricePerG": String,
    "totalAmount": String,
    "taxPercent": String,
    "tax2Perc": String,
    "taxAmount": String,
    "taxType": String,
    "billingAddress": Object

})

const buyAndTransferModel = mongoose.model('buyAndTransfer', buyAndTransferSchema);

module.exports = buyAndTransferModel;