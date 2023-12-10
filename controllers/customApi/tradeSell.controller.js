
const { v4: uuidv4 } = require('uuid');
const validator = require('validator');
// const Joi = require('joi');
const tradeMmtc = require('../mmtcApi/trade.controller');
const mmtcSellResponse = require('../../models/mmtc_sell_response');
const mmtcSellRequest = require('../../models/mmtc_sell_request');


let customerRefNo;
let transactionRefNo = uuidv4();
let billingAddressId
let currencyPair, value, type;
let calculationType, transactionOrderID, transactionDate;
let totalAmount, quantity,transactionId, quoteValidityTime, taxType, tax1Amt, tax2Amt, tax3Amt, tax1Perc, tax2Perc, preTaxAmount, taxAmount, quoteId, createdAt, executionDateTime, customerName



class tradeSellController{


    static sell = async (req, res) => {

        // customerRefNo = req.user._doc._id;

         ({customerRefNo, currencyPair, value, type } = req.body);

        
        /*   validation for is empty  */

        // customerRefNo validation

        if (validator.isEmpty(customerRefNo)) {
            return res.json({ message: "customerRefNo must not be empty" })
        }

        // currencyPair validation

        if (validator.isEmpty(currencyPair)) {
            return res.json({ message: "currencyPair must not be empty" })
        }

        // value validation

        if (validator.isEmpty(value)) {
            return res.json({ message: "value must not be empty" })
        }

        // type validation

        if (validator.isEmpty(type)) {
            return res.json({ message: "type must not be empty" })
        }





        const data1 = { currencyPair, value, type, customerRefNo, transactionRefNo }

        
        const response = await tradeMmtc.getQuoteSell(data1, res)
        console.log(response)
        try {
            ({
                totalAmount, quantity, quoteValidityTime, taxType, tax1Amt, tax2Amt, tax3Amt, tax1Perc, tax2Perc, preTaxAmount, taxAmount, quoteId, createdAt
            } = response);
            
                   await mmtcSellRequest.create(data1);
                await mmtcSellResponse.create({...response, customerRefNo});

                return res.json({
                    "error": false,
                    "message": "success",
                    "data": response
                });
            }
            catch(err){
                return res.json({
                "error": true,
                "message": err,
                "data": null
            })
}


    }




    //executeSell
    static executeSell = async (req, res) => {

        calculationType = type;
        transactionDate = createdAt;
        transactionOrderID = transactionRefNo;

        
        const otp = "123";
        const payOut = {
            "customerAccountInfo": {
                "name": "my Kumar",
                "accountNumber": "441750926792",
                "ifsc": "SBI0019",
                "vpa": "abhijeet@paytm"
            },
            "paymentChannel": "UPI"
        }

        const data1 = { calculationType, customerRefNo, otp, payOut, preTaxAmount, quantity, quoteId, tax1Amt, tax2Amt, transactionDate, transactionOrderID, totalAmount };

        
        try{
            const response =  await tradeMmtc.executeOrderWithPayOut(data1, res);
               // await mmtcSellRequest.findOne({customerRefNo, transactionOrderID}, data1)
               // await mmtcSellResponse.findOne({customerRefNo, transactionOrderID}, response)
                
                return res.json({
            "error": false,
            "message": "success",
            "data": response
        })
    
}catch(err){
   return res.json({
        "error": true,
        "message": err,
        "data": null
    })
    
} }



}


module.exports = tradeSellController;