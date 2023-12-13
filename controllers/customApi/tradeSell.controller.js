
const { v4: uuidv4 } = require('uuid');
const validator = require('validator');
const tradeMmtc = require('../mmtcApi/trade.controller');
const mmtcSellResponse = require('../../models/mmtc_sell_response.models.js');
const mmtcSellRequest = require('../../models/mmtc_sell_request.models.js');





class tradeSellController {


    static customerRefNo;
    static transactionRefNo = uuidv4();
    static billingAddressId
    static currencyPair
    static value
    static type
    static calculationType;
    static transactionOrderID;
    static transactionDate;
    static totalAmount;
    static quantity;
    static transactionId;
    static quoteValidityTime
    static taxType;
    static tax1Amt;
    static tax2Amt;
    static tax3Amt;
    static tax1Perc;
    static tax2Perc;
    static preTaxAmount;
    static taxAmount;
    static quoteId;
    static createdAt;
    static executionDateTime;
    static customerName




    static sell = async (req, res) => {

        const customerRefNo = req.user._id.toString();
        console.log(customerRefNo)

        this.currencyPair = req.body.currencyPair;
        this.value = req.body.value;
        this.type = req.body.type;

        console.log(typeof this.currencyPair)


        const data1 = { currencyPair: this.currencyPair, value: this.value, type: this.type, customerRefNo, transactionRefNo: this.transactionRefNo }
        console.log(data1)


        /*   validation for isEmpty & isString  */


        if (typeof customerRefNo !== 'string') {
            return res.status(500).json({
                "error": true,
                "message": "customerRefNo should be in string",
                "data": null
            });
        }


        if (typeof currencyPair !== 'string') {
            return res.status(500).json({
                "error": true,
                "message": "currencyPair should be in string",
                "data": null
            });
        }


        if (typeof value !== 'string') {
            return res.status(500).json({
                "error": true,
                "message": "value should be in string",
                "data": null
            });
        }


        if (typeof type != 'string') {
            return res.status(500).json({
                "error": true,
                "message": "type should be in string",
                "data": null
            });
        }






        if (validator.isEmpty(customerRefNo)) {
            return res.status(400).json({
                error: true,
                message: "customerRefNo must not be empty",
                data: null
            });
        }

        // currencyPair validation

        if (validator.isEmpty(currencyPair)) {
            return res.status(400).json({
                error: true,
                message: "currencyPair must not be empty",
                data: null
            });
        }

        // value validation

        if (validator.isEmpty(value)) {
            return res.status(400).json({
                error: true,
                message: "value must not be empty",
                data: null
            });
        }

        // type validation

        if (validator.isEmpty(type)) {
            return res.status(400).json({
                error: true,
                message: "type must not be empty",
                data: null
            });
        }



        //getQuoteSell



        const response = await tradeMmtc.getQuoteSell(data1, res)
        console.log(response)
        try {
            ({
                totalAmount: this.totalAmount, quantity: this.quantity, quoteValidityTime: this.quoteValidityTime, taxType: this.taxType, tax1Amt: this.tax1Amt, tax2Amt: this.tax2Amt, tax3Amt: this.tax3Amt, tax1Perc: this.tax1Perc, tax2Perc: this.tax2Perc, preTaxAmount: this.preTaxAmount, taxAmount: this.taxAmount, quoteId: this.quoteId, createdAt: this.createdAt
            } = response);

            await mmtcSellRequest.create(data1);
            await mmtcSellResponse.create({ ...response, customerRefNo });

            return res.json({
                "error": false,
                "message": "success",
                "data": [response]
            });
        }
        catch (error) {
            error = JSON.parse(error.message);
            const errorReason = error.reason;
            const errorCode = error.code;

            return res.json({
                "error": true,
                "message": errorReason,
                "data": null,
                "code": errorCode
            })
        }


    }




    //executeSell
    static executeSell = async (req, res) => {
        const customerRefNo = req.user._id.toString();

        this.calculationType = this.type;
        this.transactionDate = this.createdAt;
        this.transactionOrderID = this.transactionRefNo;


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

        const data1 = { calculationType: this.calculationType, customerRefNo, otp, payOut, preTaxAmount: this.preTaxAmount, quantity: this.quantity, quoteId: this.quoteId, tax1Amt: this.tax1Amt, tax2Amt: this.tax2Amt, transactionDate: this.transactionDate, transactionOrderID: this.transactionOrderID, totalAmount: this.totalAmount };


        try {
            const response = await tradeMmtc.executeOrderWithPayOut(data1, res);
            // await mmtcSellRequest.findOne({customerRefNo, transactionOrderID}, data1)
            // await mmtcSellResponse.findOne({customerRefNo, transactionOrderID}, response)

            return res.json({
                "error": false,
                "message": "success",
                "data": [response]
            })

        } catch (error) {
            error = JSON.parse(error.message);
            const errorReason = error.reason;
            const errorCode = error.code;

            return res.json({
                "error": true,
                "message": errorReason,
                "data": null,
                "code": errorCode
            })

        }
    }



}


module.exports = tradeSellController;