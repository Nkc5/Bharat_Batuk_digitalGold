
const { v4: uuidv4 } = require('uuid');
const validator = require('validator');
// const Joi = require('joi');
const tradeMmtc = require('../mmtcApi/trade.controller');
const mmtcBuyRequest = require('../../models/mmtc_buy_request.models.js');
const mmtcBuyResponse = require('../../models/mmtc_buy_response.models.js');
const mmtcSellResponse = require('../../models/mmtc_sell_response.models.js');
const userModel = require('../../models/user.models.js');
const addressModel = require('../../models/address.models.js');
const refferalModel = require('../../models/referral.models.js');
const userMMtc = require('../mmtcApi/user.controller')
const transferModel = require('../../models/transfer.models.js')
const buyAndTransferModel = require('../../models/buyAndTransfer.models.js')
const initiateConfirmTransferModel = require('../../models/initiateConfirmTransfer.models.js')
const NodeMailer = require('./nodeMailer.controller.js');
const fs = require('fs');
const kycModel = require('../../models/kyc.models.js')
const p2p=require('./p2p.controller.js')
const redeemModel = require('../../models/mmtc_redeem.models.js');
const adharModel = require('../../models/adhar.models.js');
const panModel = require('../../models/pan.models.js');
const History=require('../augmont_api/getorderHistory.js')


var tax3AmtBuy; 

class tradeBuyController {



    static transactionOrderID;
    static transactionDate;
    static createdAt;
    static transactionRefNo;






    //getNonExecutableQuote

    static getNonExecutableQuote = async (req, res) => {

        const { currencyPair, type } = req.body;
        const data = req.body;


        console.log("data", data);

        /* isString & isEmpty validation     */


        // currencyPair validation
        if (typeof currencyPair !== "string") {
            return res.status(400).json({
                "error": true,
                "message": "currencyPair must be string",
                "data": []
            })
        }

        if (typeof type !== "string") {
            return res.status(400).json({
                "error": true,
                "message": "type must be string",
                "data": []
            })
        }


        // currencyPair validation
        if (validator.isEmpty(currencyPair)) {
            return res.status(400).json({
                "error": true,
                "message": "currencyPair must not be empty",
                "data": []
            })
        }

        if (validator.isEmpty(type)) {
            return res.status(400).json({
                "error": true,
                "message": "type must not be empty",
                "data": []
            })
        }





        try {

            // mmtc getQuoteBuy  call
            const response = await tradeMmtc.getNonExecutableQuote(data, res);

            console.log("response", response);
            
            return res.json({
                "error": false,
                "message": "success",
                "data": [response]
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





    /*          BUY        */

    // buy api
    static buy = async (req, res) => {

        // access customerRefNo from req.user
        const customerRefNo = req.user._id.toString();

        const transactionRefNo = uuidv4().slice(0, 32);

        // access currencyPair, value, type from body
        var { currencyPair, value, type } = req.body;
        const buyType = type;

        var data = { currencyPair, value, type, transactionRefNo, customerRefNo }

        // access mmtcCustRef from req.user
        const user = await userModel.findOne({ _id: customerRefNo })
        const mmtcCustRef = user.mmtc_customer_ref;
        // const userProfile = req.user;


        console.log("getQuoteBuy", data);

        const adhar = await adharModel.findOne({customerRefNo}).sort({_id: -1});
        const pan = await panModel.findOne({customerRefNo}).sort({_id: -1});

        console.log("adhar", adhar)
        if(!adhar && !pan){
            data.customerRefNo = "65b8d31285d86e81e770f30f"
        }
        else if(!mmtcCustRef && (adhar || pan)){
            // create profile   & register billing address in mmtc
            var returnedUser = await tradeBuyController.createProfile(req, res, user);

             // after create profile, register billing address in mmtc
        // const billAddress = await addressModel.findOne({ $and: [{ customerRefNo }, { type: "B" }, { is_deleted: 0 }] })

        // if (billAddress) {

        //     if (!billAddress.id) {

        //         try {

        //             const billAddressObj = billAddress.toObject();
        //             const { city, country, line1, line2, mobileNumber, name, statecode, state, type, zip, ...rest } = billAddressObj
        //             const result = await userMMtc.addUpdateAddress({ city, country, line1, line2, mobileNumber, name, statecode, state, type, zip, customerRefNo }, res);
        //             console.log("result", result);
        //             billAddress.id = result.id;

        //             billAddress.mmtc_customer_ref = result.customerRefNo

        //             await billAddress.save();
        //         }

        //         catch (error) {
        //             console.log(error)

        //             const errorMessage = JSON.parse(error.message);
        //             const errorReason = errorMessage.reason;
        //             const errorCode = errorMessage.code;

        //             return res.json({
        //                 "error": true,
        //                 "message": errorReason,
        //                 "data": [],
        //                 "code": errorCode
        //             })
        //         }
        //     }
        // }

        }

        // if(!mmtcCustRef){
        //     data.customerRefNo = "65b8d31285d86e81e770f30f"
        // }

       
        // else {
        //     return res.status(400).json({
        //         "error": true,
        //         "message": "Please provide billing address",
        //         "data": [],
        //     })
        // }


        //   KYC validation
        // const kyc = await kycModel.findOne({ customerRefNo });
        // if (kyc) {
        //     if (!kyc.name || !kyc.pan_no || !kyc.adhar_no || !kyc.account_no || !kyc.ifsc || !kyc.bank_name || !kyc.branch_name || !billAddress || !billAddress.id ) {
        //         data.customerRefNo = "65b8d31285d86e81e770f30f";
        //     }
        // }
        // else {
        //     data.customerRefNo = "65b8d31285d86e81e770f30f";
        // }

        /* isString & isEmpty validation     */


        // currencyPair validation
        if (typeof currencyPair !== "string") {
            return res.json({
                "error": true,
                "message": "currencyPair must be string",
                "data": []
            })
        }

        // value validation
        if (typeof value !== "string") {
            return res.json({
                "error": true,
                "message": "value must be string",
                "data": []
            })
        }

        // type validation
        if (typeof type !== "string") {
            return res.json({
                "error": true,
                "message": "type must be string",
                "data": []
            })
        }



        // currencyPair validation
        if (validator.isEmpty(currencyPair)) {
            return res.json({
                "error": true,
                "message": "currencyPair must not be empty",
                "data": []
            })
        }

        // value validation
        if (validator.isEmpty(value)) {
            return res.json({
                "error": true,
                "message": "value must not be empty",
                "data": []
            })
        }

        // type validation
        if (validator.isEmpty(type)) {
            return res.json({
                "error": true,
                "message": "type must not be empty",
                "data": []
            })
        }


        try {

            console.log("getQuoteBuy after kyc", data);


            // mmtc getQuoteBuy  call
            var response = await tradeMmtc.getQuoteBuy(data, res);
            tax3AmtBuy = response.tax3Amt;

            const buyRequestQuote = await mmtcBuyRequest.create(data);
            console.log("buyRequestQuote", buyRequestQuote)
            const buyQuoteResponse = await mmtcBuyResponse.create(response);
            console.log("buyQuoteResponse", buyQuoteResponse)

            return res.json({
                "error": false,
                "message": "success",
                "data": [{ ...response, buyType, transactionRefNo }]
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




    //validateBuy
    static validateBuy = async (req, res) => {


        const customerRefNo = req.user._id.toString();


        // access data from body
        var { buyType, preTaxAmount, quantity, quoteId, tax1Amt, tax2Amt, createdAt, totalAmount, transactionRefNo } = req.body;

        const calculationType = buyType;
        const transactionDate = createdAt;
        const transactionOrderID = transactionRefNo;

        // console.log("tax3Amt", tax3Amt)

        const data = { calculationType, transactionDate, preTaxAmount, quantity, quoteId, tax1Amt, tax2Amt, totalAmount, customerRefNo, transactionOrderID, tax3Amt: tax3AmtBuy};

        // const data = { calculationType, transactionDate, transactionOrderID};

        console.log("validate", data);



        try {

            // call mmtc
            var response = await tradeMmtc.validateQuotePartnerPg(data, res)

            const buyValidate = await mmtcBuyRequest.findOneAndUpdate({ customerRefNo, "transactionRefNo": transactionOrderID }, data, { new: true });

            console.log("buyValidate", buyValidate);


            return res.json({
                "error": false,
                "message": "success",
                "data": [response]
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

    /* response : 200 Data Validated */



    //executeBuy
    static executeBuy = async (req, res) => {

        const customerRefNo = req.user._id.toString();


        const billingAddressUser = await addressModel.findOne({ $and: [{ customerRefNo }, { type: "B" }, { is_deleted: 0 }] }).sort({_id:-1})



        console.log("billingAddressUser", billingAddressUser)

        if (billingAddressUser === null) {
            return res.status(400).json({
                "error": true,
                "message": "no billing address found",
                "data": []
            });
        }



        const billingAddressId = billingAddressUser.id;

        console.log("billingAddressId", billingAddressId)

        if (billingAddressId === undefined || billingAddressId === null) {
            return res.status(400).json({
                "error": true,
                "message": "must have billing address id",
                "data": []
            });
        }




        var { buyType, preTaxAmount, quantity, quoteId, tax1Amt, tax2Amt, createdAt, totalAmount, transactionRefNo, rezorpayTid} = req.body;

        const transactionOrderID = transactionRefNo;
        const calculationType = buyType;
        const transactionDate = createdAt

        // const data = { calculationType, transactionDate, preTaxAmount, quantity, quoteId, tax1Amt, tax2Amt, totalAmount, billingAddressId, customerRefNo, transactionOrderID, rezorpayTid, tax3Amt: tax3AmtBuy}

        
        const data = { calculationType, transactionDate, preTaxAmount, quantity, quoteId, tax1Amt, tax2Amt, totalAmount, billingAddressId, customerRefNo, transactionOrderID, rezorpayTid}

        console.log("execute", data)

        try {
            // call mmtc
            var response = await tradeMmtc.executeOrderPartnerPg(data, res)
            // console.log(response)
            const executeBuyRequest = await mmtcBuyRequest.findOneAndUpdate({ customerRefNo, transactionOrderID }, data, { new: true });
            console.log("executeBuyRequest", executeBuyRequest)

            //buyDB 
            const buyDB = await mmtcBuyResponse.find({ customerRefNo });

            const executeBuyResponse = await mmtcBuyResponse.findOneAndUpdate({ quoteId }, { ...response, rezorpayTid }, { new: true });
            console.log("executeBuyResponse", executeBuyResponse)


            // buy&transfer
            const referralDB = await refferalModel.findOne({ customerRefNo });

            console.log("buyDB", buyDB)
            console.log("referralDB", referralDB)

            let buyEmpty = true;
            if (buyDB.length > 0) {
                for (const buy of buyDB) {
                    if (buy.orderId) {
                        buyEmpty = false;
                        break;
                    }
                }
            }

            console.log("buyEmpty", buyEmpty)

            if (buyEmpty && Number(response.netAmount) > 1000 && referralDB.referredBy) {
                console.log("in transfer if")
                const referralResponse = await tradeBuyController.referralCode(req, res, referralDB);
            }

            //generateBuyPdfInvoice
            // req.customData = response;
            var returnedPDF = await tradeBuyController.generateBuyPdfInvoice(req, res, response);


            return res.json({
                "error": false,
                "message": "success",
                "data": [returnedPDF]
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




    static generateBuyPdfInvoice = async (req, res, executeResponse) => {

        const customerRefNo = req.user._id.toString();
        var transactionId = executeResponse.orderId.transactionId;

        console.log("transactionId", transactionId);

        try {


            var response = await tradeMmtc.generateBuyPdfInvoice({ transactionId }, res)




            const folderPath = `public/uploads/invoice/${customerRefNo}`;

            // Check if the folder already exists
            if (!fs.existsSync(folderPath)) {
                // If not, create the folder
                fs.mkdirSync(folderPath);
                console.log('custRef Folder successfully');

                const folderPath2 = `public/uploads/invoice/${customerRefNo}/buy`;
                fs.mkdirSync(folderPath2);
                console.log('buy Folder successfully');
            }



            // Decode base64 string
            const binaryString = Buffer.from(response, 'base64');

            // Specify the path to the public/uploads folder
            const filePath = `public/uploads/invoice/${customerRefNo}/buy/${transactionId}.pdf`;

            // Write the binary data to a file
            fs.writeFileSync(filePath, binaryString);

            console.log(`File saved at: ${filePath}`);

            const buyResponse = await mmtcBuyResponse.findOneAndUpdate({ 'orderId.transactionId': transactionId }, { invoicePDF: filePath }, { new: true })


            console.log("buyResponse", buyResponse);


            const newFilePath = filePath.replace('public', "");
            // req.customData.invoicePDF = newFilePath;


            // sending email through nodemailer;
            executeResponse.invoicePDF = newFilePath;
            await NodeMailer.toSendEmail(req, res, "buy", req.user, executeResponse);

            return executeResponse;


        } catch (error) {
            console.log(error)
            return res.json(error);

        }
    }



    /*
    
    
        //buyAndTransferPartnerPg:  completed
    
    
        const { buyCustomerRefNo, channel, currencyPair, transactionDate, transactionOrderID, transferCustomerRefNo, quantity, amount, message, billingAddressId } = req;
    
    
    */

    // referral code



    static async referralCode(req, res, referralDB) {

        try {

            const referredByDb = await refferalModel.findOne({ referralCode: referralDB.referredBy });
            console.log("referredByDb", referredByDb)

            const transferCustomerRefNo = referredByDb.customerRefNo;
            console.log("transferCustomerRefNo", transferCustomerRefNo)

            const channel = "web"
            const currencyPair = "XAU/INR"
            const transactionDate = new Date().toISOString();
            const transactionOrderID = uuidv4();
            const message = "Referral Gift By Bharat Batuk";
            const amount = "100";
            let buyCustomerRefNo = "65a5277ef779fbace97c9990";
            let billingAddressId = "nELGjmvQzdZynwzMDDr2X";
            let quantity

            const getNonExecutableQuote = await tradeMmtc.getNonExecutableQuote({
                currencyPair: "XAU/INR",
                type: "BUY"
            }, res);

            quantity = (100 / getNonExecutableQuote.preTaxAmount).toFixed(2);

            console.log("quantity", quantity)

            const data = { buyCustomerRefNo, channel, currencyPair, transactionDate, transactionOrderID, transferCustomerRefNo, quantity, amount, message, billingAddressId }

            console.log("buy&transfer payload", data)

            var buyAndTransferResponse = await tradeMmtc.buyAndTransferPartnerPg(data, res);

            console.log("buy&buyAndTransferResponse ", buyAndTransferResponse)


            if (buyAndTransferResponse) {
                var referralDBResponse = await refferalModel.findOneAndUpdate({ referralCode: referralDB.referredBy },
                    { $inc: { count: -1 } },  // decrement count by 1
                    { new: true })

                console.log("referralDBResponse", referralDBResponse)
            }

            return;
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


    //getOrderHistory    :  completed
    static getOrderHistory = async (req, res) => {

        const customerRefNo = req.user._id.toString();

        var { endDate, startDate } = req.body;

        const data = { endDate, startDate, customerRefNo };


        if (typeof endDate !== 'string') {

            return res.status(400).json({
                "error": true,
                "message": "End date should be in string",
                "data": []
            })
        }

        if (typeof customerRefNo !== 'string') {

            return res.status(400).json({
                "error": true,
                "message": "CustomerRefNo should be in string",
                "data": []
            })
        }
        if (typeof startDate !== 'string') {

            return res.status(400).json({
                "error": true,
                "message": "Start date should be in string",
                "data": []
            })
        }


        if (validator.isEmpty(customerRefNo)) {

            return res.status(400).json({
                "error": true,
                "message": "CustomerRefNo must not be empty",
                "data": []
            })
        }
        if (validator.isEmpty(endDate)) {

            return res.status(400).json({
                "error": true,
                "message": "End date should not be empty",
                "data": []
            })
        }

        if (validator.isEmpty(startDate)) {

            return res.status(400).json({
                "error": true,
                "message": "Start date should not be empty",
                "data": []
            })
        }



        console.log(data);

        // mmtc getOrderHistory call
        try {
       
            const Augmont_data = await History.History(req, res);
           
            const response = await tradeMmtc.getOrderHistory(data, res);
         
        
            console.log("response", response);
        //   const p2p1=
            const newArray = response.map(obj => {
                if (obj.quantity.startsWith("-")) {
                    obj.quantity = obj.quantity.slice(1);
                }

                if(obj.productSku.includes("XAU_DMM")){
                    obj.type = obj.type.toUpperCase() + " GOLD"
                }
                else if(obj.productSku.includes("XAG_DMM")){
                    obj.type = obj.type.toUpperCase() + " SILVER"
                }

                obj.date = obj.createdAt.split('T')[0];

                return obj;
            });
            const combinedData = [...newArray, ...Augmont_data];
            console.log("newArray",newArray)

            // Log createdAt timestamps before sorting
            console.log("Before Sorting:");
            console.log(combinedData.map(item => item.createdAt));
            
            const sortedCombinedData = combinedData.sort((a, b) => {
                // Convert createdAt strings to Date objects for comparison
                const dateA = new Date(a.createdAt);
                const dateB = new Date(b.createdAt);
              
                // Return negative value if a is later than b (descending order)
                return dateB - dateA;
              });
            console.log("sortedCombinedData", sortedCombinedData);
            
            
            
            

            console.log("newResponse", newArray)

            return res.json({
                "error": false,
                "message": "success",
                "data":sortedCombinedData
            });
        } catch (error) {
            console.log("error", error)
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


    //getReddemHistory:  completed (showing blank object)
    static getRedeemHistory = async (req, res) => {
        try {

            const customerRefNo = req.user._id.toString();


            const { endDate, startDate } = req.body;


            /* isEmpty & isString validation  */


            if (typeof endDate !== 'string') {

                return res.status(400).json({
                    "error": true,
                    "message": "End date should be in string",
                    "data": []
                })
            }

            if (typeof customerRefNo !== 'string') {

                return res.status(400).json({
                    "error": true,
                    "message": "CustomerRefNo must not be in string",
                    "data": []
                })
            }
            if (typeof startDate !== 'string') {

                return res.status(400).json({
                    "error": true,
                    "message": "Start date should be in string",
                    "data": []
                })
            }


            if (validator.isEmpty(customerRefNo)) {

                return res.status(400).json({
                    "error": true,
                    "message": "CustomerRefNo must not be empty",
                    "data": []
                })

            }
            if (validator.isEmpty(endDate)) {

                return res.status(400).json({
                    "error": true,
                    "message": "End date should not be empty",
                    "data": []
                })

            }

            if (validator.isEmpty(startDate)) {

                return res.status(400).json({
                    "error": true,
                    "message": "Start date should not be empty",
                    "data": []
                })
            }



            let data = { ...req.body, customerRefNo };

            console.log(data);


            // mmtc getRedeemHistory call
            const response = await tradeMmtc.getRedeemHistory(data, res);

            return res.json({
                "error": false,
                "message": "success",
                "data": [response]
            });
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


    //getOrderDetails : completed(I put transaction id of buy in order id)

    static getOrderDetails = async (req, res) => {
        //  transactionId = "BBTZRLF6CGWKJ8V";

        let { transactionId, type } = req.body;
        // const data = req.body;

        type = type.split(' ')[0];

        console.log(type);
        console.log(transactionId);


        /* isEmpty & isString validation  */


        if (typeof transactionId !== 'string') {

            return res.json({
                "error": true,
                "message": "TransactionId should be a string",
                "data": []
            })
        }

        if (typeof type !== 'string') {

            return res.json({
                "error": true,
                "message": "Type should be a string",
                "data": []
            })
        }



        if (validator.isEmpty(transactionId)) {

            return res.json({
                "error": true,
                "message": "TransactionId must not be empty",
                "data": []
            })
        }

        if (validator.isEmpty(type)) {

            return res.json({
                "error": true,
                "message": "Type should not be empty",
                "data": []
            })
        }

        console.log("data", { transactionId, type });



        try {

            // mmtc getRedeemHistory call
            const response = await tradeMmtc.getOrderDetails({ transactionId, type }, res);


            var invoicePath;
            if (type === "BUY") {

                const taxes = JSON.parse(response.taxes);
                response.taxes = taxes;
                var invoice = await mmtcBuyResponse.findOne({ "orderId.transactionId": transactionId });
                invoice ?
                invoicePath = invoice.invoicePDF.replace('public', '') : invoicePath ="";

            }

            else if (type === "SELL") {
                var invoice = await mmtcSellResponse.findOne({ transactionId: transactionId });
                invoice ?
                invoicePath = invoice.invoicePDF.replace('public', '') : invoicePath ="";
            }
            else if (type === "REDEEM") {
                var invoice = await redeemModel.findOne({ orderId: transactionId });
                console.log("invoice", invoice)
                invoice ?
                invoicePath = invoice.invoicePDF.replace('public', '') : invoicePath ="";
            }

            if (response.quantity < 0) {
                let newQuantity = response.quantity.replace("-", "");
                response.quantity = newQuantity;

            }

            console.log("invoicePath", invoicePath)


            return res.json({
                "error": false,
                "message": "Success",
                "data": [{ ...response, invoicePath, transactionId }]
            });
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


    //getDeliveryStatus: completed(I put transaction id of buy in order id)

    static getDeliveryStatus = async (req, res) => {
        //   orderId = "BBT1fioxey5nq4Y";

        const { orderId } = req.body;
        const data = req.body;
        console.log(data);


        /* isEmpty & isString validation  */

        if (typeof orderId !== 'string') {

            return res.status(500).json({
                "error": true,
                "message": "orderId should be in string",
                "data": null
            });
        }

        if (validator.isEmpty(orderId)) {

            return res.status(500).json({
                "error": true,
                "message": "orderId must not be empty",
                "data": []
            });
        }


        // let data = req.body;

        console.log(data);

        // mmtc getDeliveryStatus call
        try {
            const response = await tradeMmtc.getDeliveryStatus(data, res);
            //  console.log(response)
            return res.json({
                "error": false,
                "message": "success",
                "data": [response]
            });
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



    //checkTradeStatus: completed(from getOrderDetails's response will get clientOrderID)

    static checkTradeStatus = async (req, res) => {



        const customerRefNo = req.user._id.toString();

        const { clientOrderID } = req.body;
        const data = { ...req.body, customerRefNo };

        console.log(clientOrderID)
        console.log(typeof clientOrderID)

        /* isEmpty & isString validation  */

        if (typeof customerRefNo !== 'string') {
            return res.status(500).json({
                "error": true,
                "message": "customerRefNo should be in string",
                "data": []
            });
        }

        if (typeof clientOrderID !== 'string') {
            return res.status(500).json({
                "error": true,
                "message": "clientOrderId must  be in string",
                "data": []
            });
        }

        if (validator.isEmpty(clientOrderID)) {

            return res.status(500).json({
                "error": true,
                "message": "ClientOrderId must not be empty",
                "data": []
            });
        }

        if (validator.isEmpty(customerRefNo)) {

            return res.status(500).json({
                "error": true,
                "message": "customerRefNo should not be empty",
                "data": []
            });
        }



        // let data = req.body;

        console.log(data);

        // mmtc checkTradeStatus call
        try {
            const response = await tradeMmtc.checkTradeStatus(data, res);

            return res.json({
                "error": false,
                "message": "success",
                "data": [response]
            });
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


    //initiatetransfer:  completed (first must buy gold )

    static initiateTransfer = async (req, res) => {
        const srcCustomerRefNo = req.user._id.toString();

        const {
            currencyPair, dstCustomerRefNo, dstMobileNumber, email, name, isKycRequired, channel, quantity
        } = req.body;

        const transactionDate = new Date().toString();
        const transactionOrderID = uuidv4();

        const data = { ...req.body, srcCustomerRefNo, transactionDate, transactionOrderID }


        // console.log("initiateTransfer data", data)

        /* isEmpty & isString validation  */


        if (typeof dstCustomerRefNo !== 'string') {
            return res.status(500).json({
                "error": true,
                "message": "dstCustomerRefNo should be in string",
                "data": []
            });
        }

        if (typeof dstMobileNumber !== 'string') {
            return res.status(500).json({
                "error": true,
                "message": "dstMobileNumber should be in string",
                "data": []
            });
        }

        if (typeof email !== 'string') {
            return res.status(500).json({
                "error": true,
                "message": "email should be in string",
                "data": []
            });
        }
        if (typeof name !== 'string') {
            return res.status(500).json({
                "error": true,
                "message": "name should be in string",
                "data": []
            });
        }
        if (typeof srcCustomerRefNo !== 'string') {
            return res.status(500).json({
                "error": true,
                "message": "srcCustomerRefNo should be in string",
                "data": []
            });
        }

        if (typeof transactionDate !== 'string') {
            return res.status(500).json({
                "error": true,
                "message": "transactionDate should be in string",
                "data": []
            });
        }
        if (typeof transactionOrderID !== 'string') {
            return res.status(500).json({
                "error": true,
                "message": "transactionOrderID should be in string",
                "data": []
            });
        }
        if (typeof channel !== 'string') {
            return res.status(500).json({
                "error": true,
                "message": "channel should be in string",
                "data": []
            });
        }
        if (typeof quantity !== 'string') {
            return res.status(500).json({
                "error": true,
                "message": "quantity should be in string",
                "data": []
            });
        }
        if (typeof currencyPair !== 'string') {
            return res.status(500).json({
                "error": true,
                "message": "currencyPair should be in string",
                "data": []
            });
        }



        if (validator.isEmpty(dstCustomerRefNo)) {
            return res.status(500).json({
                "error": true,
                "message": "dstCustomerRefNo must not be empty",
                "data": []
            });
        }

        if (validator.isEmpty(dstMobileNumber)) {
            return res.status(500).json({
                "error": true,
                "message": "dstMobileNumber should not be empty",
                "data": []
            });
        }

        if (!validator.isEmail(email)) {
            return res.status(500).json({
                "error": true,
                "message": "Invalid email address",
                "data": []
            });
        }

        if (validator.isEmpty(name)) {
            return res.status(500).json({
                "error": true,
                "message": "name should not be empty",
                "data": []
            });
        }

        if (validator.isEmpty(srcCustomerRefNo)) {
            return res.status(500).json({
                "error": true,
                "message": "srcCustomerRefNo should not be empty",
                "data": []
            });
        }


        if (validator.isEmpty(transactionDate)) {
            return res.status(500).json({
                "error": true,
                "message": "transactionDate should not be empty",
                "data": []
            });
        }
        if (validator.isEmpty(transactionOrderID)) {
            return res.status(500).json({
                "error": true,
                "message": "transactionOrderID should not be empty",
                "data": []
            });
        }
        if (validator.isEmpty(channel)) {
            return res.status(500).json({
                "error": true,
                "message": "channel should not be empty",
                "data": []
            });
        }
        if (validator.isEmpty(quantity)) {
            return res.status(500).json({
                "error": true,
                "message": "quantity should not be empty",
                "data": []
            });
        }
        if (validator.isEmpty(currencyPair)) {
            return res.status(500).json({
                "error": true,
                "message": "currencyPair should not be empty",
                "data": []
            });
        }


        console.log("data", data);

        try {
            const response = await tradeMmtc.initiateTransfer(data, res);

            const transfer = await initiateConfirmTransferModel.create({ ...data, ...response });
            console.log("initiateTransfer", transfer)

            return res.json({
                "error": false,
                "message": "success",
                "data": [response]
            });
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

    //confirmTranfer: completed (all data from intiate transfer's response)

    static confirmTransfer = async (req, res) => {

        const data = req.body;

        const { transferId, dstCustomerRefNo, currencyPair, transactionDate } = req.body;

        // console.log("data", data)


        /* isEmpty & isString validation  */



        if (typeof dstCustomerRefNo !== 'string') {
            return res.status(500).json({
                "error": true,
                "message": "dstCustomerRefNo should be in string",
                "data": []
            });
        }

        if (typeof transferId !== 'string') {
            return res.status(500).json({
                "error": true,
                "message": "transferId should be in string",
                "data": []
            });
        }

        if (typeof transactionDate !== 'string') {
            return res.status(500).json({
                "error": true,
                "message": "transactionDate should be in string",
                "data": []
            });
        }

        if (typeof currencyPair !== 'string') {
            return res.status(500).json({
                "error": true,
                "message": "currencyPair should be in string",
                "data": []
            });
        }



        if (validator.isEmpty(transferId)) {
            return res.status(500).json({
                "error": true,
                "message": "transferId must not be empty",
                "data": []
            });
        }

        if (validator.isEmpty(dstCustomerRefNo)) {
            return res.status(500).json({
                "error": true,
                "message": "dstCustomerRefNo should not be empty",
                "data": []
            });
        }
        if (validator.isEmpty(transactionDate)) {
            return res.status(500).json({
                "error": true,
                "message": "transactionDate should not be empty",
                "data": []
            });
        }
        if (validator.isEmpty(currencyPair)) {
            return res.status(500).json({
                "error": true,
                "message": "currencyPair should not be empty",
                "data": []
            });
        }



        try {
            const response = await tradeMmtc.confirmTransfer(data, res);


            const transfer = await initiateConfirmTransferModel.findOneAndUpdate({ transferId }, { ...data, ...response }, { new: true });
            console.log("confirmTransfer", transfer)

            return res.json({
                "error": false,
                "message": "success",
                "data": [response]
            });
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






    //transfer:  completed (all data from intiate transfer's response)
    static transfer = async (req, res) => {

        const srcCustomerRefNo = req.user._id.toString();

        const { channel, currencyPair, dstCustomerRefNo, quantity } = req.body;

        const transactionOrderID = uuidv4();
        const transactionDate = new Date().toString();

        const data = { ...req.body, srcCustomerRefNo, transactionDate, transactionOrderID };
        console.log(data);


        /* isEmpty & isString validation  */



        if (typeof dstCustomerRefNo !== 'string') {
            return res.status(500).json({
                "error": true,
                "message": "dstCustomerRefNo should be in string",
                "data": []
            });
        }

        if (typeof srcCustomerRefNo !== 'string') {
            return res.status(500).json({
                "error": true,
                "message": "srcCustomerRefNo should be in string",
                "data": []
            });
        }

        if (typeof transactionDate !== 'string') {
            return res.status(500).json({
                "error": true,
                "message": "transactionDate should be in string",
                "data": []
            });
        }
        if (typeof transactionOrderID !== 'string') {
            return res.status(500).json({
                "error": true,
                "message": "transactionOrderID should be in string",
                "data": []
            });
        }
        if (typeof channel !== 'string') {
            return res.status(500).json({
                "error": true,
                "message": "channel should be in string",
                "data": []
            });
        }
        if (typeof quantity !== 'string') {
            return res.status(500).json({
                "error": true,
                "message": "quantity should be in string",
                "data": []
            });
        }
        if (typeof currencyPair !== 'string') {
            return res.status(500).json({
                "error": true,
                "message": "currencyPair should be in string",
                "data": []
            });
        }




        if (validator.isEmpty(dstCustomerRefNo)) {
            return res.status(500).json({
                "error": true,
                "message": "dstCustomerRefNo must not be empty",
                "data": []
            });
        }

        if (validator.isEmpty(channel)) {
            return res.status(500).json({
                "error": true,
                "message": "channel should not be empty",
                "data": []
            });
        }

        if (validator.isEmpty(currencyPair)) {
            return res.status(500).json({
                "error": true,
                "message": "currencyPair should not be empty",
                "data": []
            });
        }

        if (validator.isEmpty(quantity)) {
            return res.status(500).json({
                "error": true,
                "message": "quantity should not be empty",
                "data": []
            });
        }

        if (validator.isEmpty(srcCustomerRefNo)) {
            return res.status(500).json({
                "error": true,
                "message": "srcCustomerRefNo should not  be empty",
                "data": []
            });
        }

        if (validator.isEmpty(transactionDate)) {
            return res.status(500).json({
                "error": true,
                "message": "transactionDate should not be empty",
                "data": []
            });
        }
        if (validator.isEmpty(transactionOrderID)) {
            return res.status(500).json({
                "error": true,
                "message": "transactionOrderID should not be empty",
                "data": []
            });
        }



        try {
            const response = await tradeMmtc.transfer(data, res);

            const transfer = await transferModel.create({ ...data, ...response });
            console.log(transfer);


            return res.json({
                "error": false,
                "message": "success",
                "data": [response]
            });
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







    //buyAndTransferPartnerPg:  completed
    static buyAndTransferPartnerPg = async (req, res) => {


        const buyCustomerRefNo = req.user._id.toString();

        const { channel, currencyPair, transferCustomerRefNo, quantity, amount, message } = req.body;


        const billingAddressUser = await addressModel.findOne({ $and: [{ customerRefNo: buyCustomerRefNo }, { type: "B" }, { is_deleted: 0 }] })

        if (!billingAddressUser) {
            return res.status(400).json({
                "error": true,
                "message": "No billing address found!",
                "data": []
            });
        }
        const billingAddressId = billingAddressUser.id;

        if (billingAddressId === null || billingAddressId === undefined) {
            return res.status(400).json({
                "error": true,
                "message": "No billing address id(mmtc) found!",
                "data": []
            });
        }


        const transactionOrderID = uuidv4();
        const transactionDate = new Date().toString();

        const data = { ...req.body, buyCustomerRefNo, transactionDate, transactionOrderID, billingAddressId };
        console.log(data);



        /* isEmpty & isString validation  */


        if (typeof buyCustomerRefNo !== 'string') {
            return res.status(400).json({
                "error": true,
                "message": "buyCustomerRefNo should be in string",
                "data": []
            });
        }

        if (typeof channel !== 'string') {
            return res.status(400).json({
                "error": true,
                "message": "channel should be in string",
                "data": []
            });
        }

        if (typeof transactionDate !== 'string') {
            return res.status(400).json({
                "error": true,
                "message": "transactionDate should be in string",
                "data": []
            });
        }
        if (typeof transactionOrderID !== 'string') {
            return res.status(400).json({
                "error": true,
                "message": "transactionOrderID should be in string",
                "data": []
            });
        }
        if (typeof transferCustomerRefNo !== 'string') {
            return res.status(400).json({
                "error": true,
                "message": "transferCustomerRefNo should be in string",
                "data": []
            });
        }
        if (typeof quantity !== 'string') {
            return res.status(400).json({
                "error": true,
                "message": "quantity should be in string",
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




        if (validator.isEmpty(buyCustomerRefNo)) {
            return res.status(400).json({
                "error": true,
                "message": "buyCustomerRefNo must not be empty",
                "data": []
            });
        }

        if (validator.isEmpty(channel)) {
            return res.status(400).json({
                "error": true,
                "message": "channel should not be empty",
                "data": []
            });
        }

        if (validator.isEmpty(currencyPair)) {
            return res.status(400).json({
                "error": true,
                "message": "currencyPair should not be empty",
                "data": []
            });
        }

        if (validator.isEmpty(quantity)) {
            return res.status(400).json({
                "error": true,
                "message": "quantity should not be empty",
                "data": []
            });
        }

        if (validator.isEmpty(transferCustomerRefNo)) {
            return res.status(400).json({
                "error": true,
                "message": "transferCustomerRefNo should not be empty",
                "data": []
            });
        }

        if (validator.isEmpty(transactionDate)) {
            return res.status(400).json({
                "error": true,
                "message": "transactionDate should not be empty",
                "data": []
            });
        }
        if (validator.isEmpty(transactionOrderID)) {
            return res.status(400).json({
                "error": true,
                "message": "transactionOrderID should not be empty",
                "data": []
            });
        }

        if (validator.isEmpty(billingAddressId)) {
            return res.status(400).json({
                "error": true,
                "message": "billingAddressId should not be empty",
                "data": []
            });
        }




        try {
            const response = await tradeMmtc.buyAndTransferPartnerPg(data, res);

            const transfer = await buyAndTransferModel.create({ ...data, ...response });
            console.log(transfer)

            return res.json({
                "error": false,
                "message": "success",
                "data": [response]
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



    static async createProfile(req, res, userProfile) {

        try {
            const customerRefNo = userProfile._id.toString();
            console.log("dob ", userProfile)
            const dobNew = userProfile.dob.toString().split('-').reverse().join('-') + "T00:00:00.000Z";
            // customerRefNo, type
            const addressDB = await addressModel.findOne({$and: [{customerRefNo}, {type:"B"}]}).sort({_id: -1});
            console.log("address", addressDB);
            if(addressDB){
                var address= {
                    "line1": addressDB.line1,
                    "line2": addressDB.line2?addressDB.line2:"",
                    "city": addressDB.city,
                    "state": addressDB.state,
                    "zip": addressDB.zip,
                    "country": addressDB.country,
                    "mobileNumber": addressDB.mobileNumber,
                    "statecode": addressDB.statecode
                }
            }
            else{
                var address= {
                    "line1": "",
                    "line2": "",
                    "city": "",
                    "state": "",
                    "zip": 160014,
                    "country": "",
                    "mobileNumber": "",
                    "statecode": "12"
                }
            }
            /* KYC can be 'I' & KYC status can be empty {} but in delievery & billing address statecode & zip must be filled but other fields can be empty string */

            const pan = userProfile.pan_number;
            const adharDB = await adharModel.findOne({customerRefNo}).sort({_id: -1});
            if(pan){
                var kyc = {
                            nameProofType: "pan",
                            nameProofDocNo: pan
                        }

                        var kycStatus = 'Y'
            }
            // else if(adharDB){
            //         var kyc = {
            //             addressProofType: "aadhar",
            //             addressProofDocNo: adharDB.msg.Aadhar_No
            //         } 
            //         var kycStatus = 'Y'
            // }
            else{
                var kyc = {} 
                var kycStatus = 'I'
            }


            let data = {
                "fullName": userProfile.name,
                "mobileNumber": userProfile.phone,
                "emailAddress": userProfile.email?userProfile.email: "",
                "dob": dobNew,
                "customerRefNo": customerRefNo,
                "kycStatus": kycStatus,
                "kycInfo": kyc,
                "partner_id": process.env.partner_id,
                "isCorporate": "N",
                "type": "N",
                "gstin": "",
                "mainAccountNo": "",
                "deliveryAddress": address,
                "billingAddress":address
            }


            // let data = {
            //     "fullName": userProfile.name,
            //     "mobileNumber": userProfile.phone,
            //     "emailAddress": userProfile.email,
            //     "dob": dobNew,
            //     "customerRefNo": userProfile._id,
            //     "kycStatus": "Y",
            //     "kycInfo": {
            //         "nameProofType": "pan",
            //         "nameProofDocNo": "djehj2345l",
            //         "addressProofType": "",
            //         "addressProofDocNo": ""
            //     },
            //     "partner_id": process.env.partner_id,
            //     "isCorporate": "N",
            //     "type": "N",
            //     "gstin": "",
            //     "mainAccountNo": "",
            //     "deliveryAddress": {
            //         "line1": "",
            //         "line2": "",
            //         "city": "",
            //         "state": "",
            //         "zip": 110092,
            //         "country": "",
            //         "mobileNumber": "",
            //         "statecode": "07"
            //     },
            //     "billingAddress": {
            //         "line1": "",
            //         "line2": "",
            //         "city": "",
            //         "state": "",
            //         "zip": 160014,
            //         "country": "",
            //         "mobileNumber": "",
            //         "statecode": "12"
            //     }
            // }



            console.log("data", data)
            const response = await userMMtc.createProfile(data, res)
            console.log(" create profile response", response)
            console.log("response.dgCustomerRefNo", typeof response.dgCustomerRefNo)

            if (response.dgCustomerRefNo) {
                const user = await userModel.findOneAndUpdate({ _id: customerRefNo }, { mmtc_customer_ref: response.dgCustomerRefNo }, { new: true })
                console.log(user)

                const getProfile = await userMMtc.getProfile({customerRefNo , mobileNumber: userProfile.phone}, res);
                console.log("getProfile", getProfile)
                if(getProfile){
                    addressDB.id = getProfile.billingAddress[0].id;
                    addressDB.mmtc_customer_ref = response.dgCustomerRefNo;
                    await addressDB.save();
                }
                console.log("address", addressDB)
                return user;
            }

        }
        catch (error) {
            console.log("create profile error", error);
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




}

module.exports = tradeBuyController;


