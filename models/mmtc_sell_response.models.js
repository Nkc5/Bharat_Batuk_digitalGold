
const mongoose = require('mongoose');

const sellResSchema = new mongoose.Schema({

    "customerName": String,
    "customerRefNo": String,
    "totalAmount": String,
    "quantity": String,
    "quoteValidityTime": String,
    "taxType": String,
    "tax1Amt": String,
    "tax2Amt": String,
    "tax3Amt": String,
    "tax1Perc": String,
    "tax2Perc": String,
    "preTaxAmount": String,
    "taxAmount": String,
    "quoteId": String,
    "type": String,
    "orderId": String,
    "transactionId": String,
    "netAmount": String,
    "executionDateTime": String,
    "pricePerG": String,
    "taxPercent": String,
    "remainingBalance": Array,
    "billingAddressId": String,
    "invoiceId": String,
    "settlementInfo": Object,
    "vpa": String,
    "invoicePDF": String,
    "rezorpayTid": String

})

const sellResModel = mongoose.model('mmtc_sell_response', sellResSchema);

module.exports = sellResModel;