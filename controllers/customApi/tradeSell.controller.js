
const { v4: uuidv4 } = require('uuid');
const validator = require('validator');
const tradeMmtc = require('../mmtcApi/trade.controller');
const userMmtc = require('../mmtcApi/user.controller');
const userModel = require('../../models/user.models.js')
const bankModel = require('../../models/bank.models.js')
const mmtcSellResponse = require('../../models/mmtc_sell_response.models.js');
const mmtcSellRequest = require('../../models/mmtc_sell_request.models.js');
const mmtcBuyResponseModel = require('../../models/mmtc_buy_response.models.js');
const mmtcBuyRequestModel = require('../../models/mmtc_buy_request.models.js');
const NodeMailer = require('./nodeMailer.controller.js');
const axios = require('axios');
const fs = require('fs');

var tax3AmtSell;




class tradeSellController {


    static vpaValidate = async (req, res) => {

        const { vpaId } = req.body;

        console.log("vpaId", vpaId);

        try {


            const response = await tradeMmtc.vpaValidate({ vpaId }, res)

            console.log("response", response);

            return res.json({
                "error": false,
                "message": "",
                "data": [response]
            })

        } catch (error) {
            console.log(error)

            return res.json({
                "error": true,
                "message": error,
                "data": []
            })

        }



    }



    //getQuoteSell: completed

    static sell = async (req, res) => {

        var customerRefNo = req.user._id.toString();

        const mmtcCustRef = req.user.mmtc_customer_ref;

        if (!mmtcCustRef) {
            customerRefNo = "65b8d31285d86e81e770f30f"
        }

        const transactionRefNo = uuidv4();

        console.log(customerRefNo)

        var { currencyPair, value, type } = req.body;
        const sellType = type;

        const data1 = { customerRefNo, currencyPair, transactionRefNo, value, type }

        console.log("getQuoteSell", data1);

        // seven days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        try {

            const dbQuantity = await mmtcBuyResponseModel.aggregate([
                {
                    $match: {
                        customerRefNo: customerRefNo
                    }
                },
                {
                    $group: {
                        _id: "$customerRefNo",
                        totalQuantityBefore: {
                            $sum: {
                                $cond: [
                                    { $lt: ["$createdAt", sevenDaysAgo.toISOString()] },
                                    { $toDouble: "$quantity" },
                                    0
                                ]
                            }
                        },
                        totalAmountBefore: {
                            $sum: {
                                $cond: [
                                    { $lt: ["$createdAt", sevenDaysAgo.toISOString()] },
                                    { $toDouble: "$totalAmount" },
                                    0
                                ]
                            }
                        }
                    }
                }
            ]);


            const totalQuantityBefore = dbQuantity[0].totalQuantityBefore;
            const totalAmountBefore = dbQuantity[0].totalAmountBefore;

            // if((type ==='Q' && Number(value) > dbQuantity[0].totalQuantityBefore) || (type ==='A' && Number(value) > dbQuantity[0].totalAmountBefore)){
            //     return res.status(400).json({
            //         error: true,
            //         message: `can't sell more than ${type ==='Q'?totalQuantityBefore +' quantity': totalAmountBefore + ' amount'}`,
            //         data: []
            //     })
            // }

        }
        catch (error) {
            console.log("error", error)
        }




        /*   validation for isEmpty & isString  */


        if (typeof customerRefNo !== 'string') {
            return res.status(400).json({
                "error": true,
                "message": "customerRefNo should be in string",
                "data": []
            });
        }


        if (typeof currencyPair !== 'string') {
            return res.status(400).json({
                "error": true,
                "message": "currencyPair should be in string",
                "data": []
            });
        }


        if (typeof value !== 'string') {
            return res.status(400).json({
                "error": true,
                "message": "value should be in string",
                "data": []
            });
        }


        if (typeof type != 'string') {
            return res.status(400).json({
                "error": true,
                "message": "type should be in string",
                "data": []
            });
        }


        if (validator.isEmpty(customerRefNo)) {
            return res.status(400).json({
                error: true,
                message: "customerRefNo must not be empty",
                data: []
            });
        }

        // currencyPair validation

        if (validator.isEmpty(currencyPair)) {
            return res.status(400).json({
                error: true,
                message: "currencyPair must not be empty",
                data: []
            });
        }

        // value validation

        if (validator.isEmpty(value)) {
            return res.status(400).json({
                error: true,
                message: "value must not be empty",
                data: []
            });
        }

        // type validation

        if (validator.isEmpty(type)) {
            return res.status(400).json({
                error: true,
                message: "type must not be empty",
                data: []
            });
        }

        //getQuoteSell

        try {

            var response = await tradeMmtc.getQuoteSell(data1, res)
            await mmtcSellRequest.create(data1);
            await mmtcSellResponse.create({ ...response, customerRefNo });

            console.log(" sell:    { ...response, transactionRefNo, sellType }", { ...response, transactionRefNo, sellType })

            return res.json({
                "error": false,
                "message": "success",
                "data": [{ ...response, transactionRefNo, sellType }]
            });
        }
        catch (error) {
            console.log(error)
            const errorMessage = JSON.parse(error.message);
            const errorReason = errorMessage.reason;
            const errorCode = errorMessage.code;

            return res.json({
                "error": true,
                "message": errorReason,
                "data": [],
                "code": errorCode
            })
        }


    }




    //executeSell :  completed
    static executeSell = async (req, res) => {
        var customerRefNo = req.user._id.toString();


        const user = await userModel.findOne({ _id: customerRefNo });



        var { preTaxAmount, quantity, quoteId, tax1Amt, tax2Amt, tax3Amt, createdAt, totalAmount, transactionRefNo, sellType } = req.body;

        console.log("req, body");

        const calculationType = sellType;
        const transactionDate = createdAt;
        const transactionOrderID = transactionRefNo



        const bank = await bankModel.findOne({ customerRefNo }).sort({ _id: -1 });
        console.log("bank", bank)
        if (bank && bank.msg.account_no && bank.msg.ifsc) {
            var ifsc = bank.msg.ifsc;
            var account_no = bank.msg.account_no;
        }
        else {
            // demo
            var ifsc = "SBIN001998"
            var account_no = "11232321117812"
        }


        // below are mandatory
        const otp = "";
        // Allowed payment channels - UPI, ACCOUNT :   "UPI/RTGS/NEFT/IMPS"
        const payOut = {
            customerAccountInfo: {
                "name": user.name,
                "accountNumber": account_no,
                "ifsc": ifsc
            },
            paymentChannel: "NEFT"
        }

        // const payOut = {
        //     customerAccountInfo: {
        //         "name": name,
        //         "accountNumber": "",
        //         "ifsc": "",
        //         "vpa": "abhijeet@paytm"
        //     },
        //     "paymentChannel": "UPI"  
        // }

        const data1 = {
            calculationType, customerRefNo, otp, payOut, preTaxAmount, quantity, quoteId, tax1Amt, tax2Amt, transactionDate, transactionOrderID, totalAmount, taxAmount: "0.00", tax1Perc: "0.00", tax2Perc: "0.00"
        };

        const data2 = {...req.body, payOut, calculationType, transactionDate, transactionOrderID, otp};


        console.log("data1", data1);


        try {
            var response = await tradeMmtc.executeOrderWithPayOut(data1, res);
            await mmtcSellRequest.findOneAndUpdate({ $and: [{ customerRefNo }, { transactionRefNo }] }, { ...data1 })
            await mmtcSellResponse.findOneAndUpdate({ $and: [{ customerRefNo }, { quoteId }] }, { ...response })

            console.log("response", response)




            //generateBSellPdfInvoice
            var returnedPDF = await tradeSellController.generateSellPdfInvoice(req, res, response);



            return res.json({
                "error": false,
                "message": "success",
                "data": [returnedPDF]
            })

        } catch (error) {
            console.log(error)
            const errorMessage = JSON.parse(error.message);
            const errorReason = errorMessage.reason;
            const errorCode = errorMessage.code;

            return res.json({
                "error": true,
                "message": errorReason,
                "data": [],
                "code": errorCode
            })

        }
    }





    static generateSellPdfInvoice = async (req, res, executeResponse) => {

        const customerRefNo = req.user._id.toString();
        const transactionId = executeResponse.transactionId;

        console.log("transactionId", transactionId);

        try {


            var response = await tradeMmtc.generateSellPdfInvoice({ transactionId }, res)




            const folderPath = `public/uploads/invoice/${customerRefNo}/sell`;

            // Check if the folder already exists
            if (!fs.existsSync(folderPath)) {
                fs.mkdirSync(folderPath);
                console.log('sell Folder successfully');
            }



            // Decode base64 string
            const binaryString = Buffer.from(response, 'base64');

            // Specify the path to the public/uploads folder
            const filePath = `public/uploads/invoice/${customerRefNo}/sell/${transactionId}.pdf`;

            // Write the binary data to a file
            fs.writeFileSync(filePath, binaryString);

            console.log(`File saved at: ${filePath}`);

            const sellResponse = await mmtcSellResponse.findOneAndUpdate({ transactionId: transactionId }, { invoicePDF: filePath }, { new: true })

            console.log("sellResponse", sellResponse);

            const newFilePath = filePath.replace('public', "");



            // sending email through nodemailer;
            executeResponse.invoicePDF = newFilePath;
            await NodeMailer.toSendEmail(req, res, "sell", req.user, executeResponse);

            return executeResponse;


        } catch (error) {
            console.log(error)
            return;
        }



    }

}


module.exports = tradeSellController;