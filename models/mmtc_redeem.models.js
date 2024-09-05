
const mongoose = require('mongoose');

const redeemSchema = new mongoose.Schema({


    /*
 "quoteId": "STFIPJFRIL33GVK",
    "orderId": "STFT8JQ25M46BRK",
    "balances": [
        {
            "balQuantity": "1.0000",
            "currencyPair": "XAU/INR",
            "blockedQuantity": "0.0000"
        },
        {
            "balQuantity": "0.0000",
            "currencyPair": "XAG/INR",
            "blockedQuantity": "0.0000"
        }
    ],
    "silverMakingCharges": "0.00",
    "goldMakingCharges": "432.20",
    "silverQuantity": 0,
    "goldQuantity": 1,
    "productList": [
        {
            "weight": "1",
            "makingCharges": "510",
            "skuId": "AXYyCPG.975410471234",
            "availableStock": "999",
            "maxQuantity": "999",
            "taxPercentage": "18",
            "images": [
                {
                    "src": "https://commerceuat.mmtcpamp.com/o/commerce-media/accounts/-1/images/244805?download=false",
                    "title": "lotus_ingot_1g_gold_front.webp",
                    "priority": 0
                }
            ],
            "deliveryInDays": "2023-04-16T13:03:31.653Z",
            "preTaxAmount": "432.20",
            "taxAmount": "77.80",
            "dimension": "5mm",
            "shape": "Coin",
            "purity": "500",
            "currencyPair": "XAU/INR"
        }
    ],
    "goldTax": "77.80",
    "silverTax": "0.00",
    "goldPreTaxAmount": "432.20",
    "silverPreTaxAmount": "0.00",
    "redeemOrderId": "3948113"
}





{
    "billingAddressId": "es8vu76axhMau64fjYTGq",
    "shippingAddressId": "es8vu76axhMau64fjYTGq",
    "orderId": "STFT8JQ25M46BRK",
    "makingCharges": 432.2,
    "taxAmount": 77.8,
    "totalAmount": 510,
    "remainingBalance": [
        {
            "balQuantity": "0.0000",
            "currencyPair": "XAU/INR",
            "blockedQuantity": "0.0000"
        },
        {
            "balQuantity": "0.0000",
            "currencyPair": "XAG/INR",
            "blockedQuantity": "0.0000"
        }
    ],
    "createdAt": "2023-04-06T13:04:04.829Z"
}



    */
    "customerRefNo": String,
    "quoteId": String,
    "orderId": String,
    "goldMakingCharges": String,
    "goldQuantity": Number,
    "productList": Array,
    "goldTax": String,
    "goldPreTaxAmount": String,
    "totalAmount": Number,
    "redeemOrderId": String,

    "billingAddressId": String,
    "shippingAddressId": String,
    "remainingBalance": Array,
    "invoicePDF": String,
    "createdAt": String,

})

const redeemModel = mongoose.model('mmtc_redeem', redeemSchema);

module.exports = redeemModel;