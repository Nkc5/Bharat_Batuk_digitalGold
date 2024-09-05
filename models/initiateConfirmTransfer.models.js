
const mongoose = require('mongoose');

const initiateConfirmSchema = new mongoose.Schema({

    "currencyPair": String,
    "dstCustomerRefNo": String,
    "dstMobileNumber": String,
    "email": String,
    "isKycRequired": String,
    "name": String,
    "srcCustomerRefNo": String,
    "transactionOrderID": String,
    "channel": String,
    "transactionDate": String,
    "quantity": String,
    "totalAmount": String,
    "pricePerG": String,
    "srcCustomerBalance": String,
    "orderId": String,
    "transferId": String,
    "dstCustomerBalance": String,
    "srcCustomerBalance": String,
    "executionDateTime": String

})

const initiateConfirmTransferModel = mongoose.model('initiateConfirmTransfer', initiateConfirmSchema);

module.exports = initiateConfirmTransferModel;