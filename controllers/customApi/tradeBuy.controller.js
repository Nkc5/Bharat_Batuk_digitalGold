
const { v4: uuidv4 } = require('uuid');
const validator = require('validator');
// const Joi = require('joi');
const tradeMmtc = require('../mmtcApi/trade.controller');
const mmtcBuyRequest = require('../../models/mmtc_buy_request');
const mmtcBuyResponse = require('../../models/mmtc_buy_response');
const userModel = require('../../models/user.models.js');
const addressModel = require('../../models/address.models.js');
const billAddressModel = require('../../models/billAddress.models.js');
const userMMtc = require('../mmtcApi/user.controller.js')

// let transferId
// let dstCustomerRefNo, dstMobileNumber, email, name, srcCustomerRefNo, isKycRequired, channel;
// let orderId;
// let clientOrderID;
// let customerRefNo, endDate, startDate;
// let transactionRefNo = uuidv4();
// let billingAddressId;
// let transactionId;
// let currencyPair, value, type;
// let calculationType, transactionOrderID, transactionDate;
// let totalAmount, quantity, quoteValidityTime, taxType, tax1Amt, tax2Amt, tax3Amt, tax1Perc, tax2Perc,
//     preTaxAmount, taxAmount, quoteId, createdAt;
// let userProfile;





class tradeBuyController {

    static transferId;
    static dstCustomerRefNo;
    static dstMobileNumber;
    static email;
    static name;
    static srcCustomerRefNo;
    static isKycRequired;
    static channel;
    static orderId;
    static clientOrderID;
    static customerRefNo;
    static endDate;
    static startDate;
    static billingAddressId;
    static transactionId;
    static currencyPair;
    static value;
    static type;
    static calculationType;
    static transactionOrderID;
    static transactionDate;
    static totalAmount;
    static quantity;
    static quoteValidityTime;
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
    static userProfile;

    static transactionRefNo;


    /*          BUY        */

    // buy api
    static buy = async (req, res) => {

        // access customerRefNo from req.user
        const customerRefNo = req.user._id;
        this.transactionRefNo = uuidv4();

        // access currencyPair, value, type from body
        this.currencyPair = req.body.currencyPair;
        this.value = req.body.value;
        this.type = req.body.type;

        let data = { ...req.body, transactionRefNo: this.transactionRefNo, customerRefNo }

        // access mmtcCustRef from req.user
        const mmtcCustRef = req.user.mmtc_customer_ref;
        this.userProfile = req.user;



        // check If have mmtcCustRef, if no than create profile
        if (!mmtcCustRef) {
            // createProfile();
            tradeBuyController.createProfile(req, res);
        }


        /* isString & isEmpty validation     */


        // currencyPair validation
        if (typeof this.currencyPair !== "string") {
            return res.json({
                "error": true,
                "message": "currencyPair must be string",
                "data": null
            })
        }

        // value validation
        if (typeof this.value !== "string") {
            return res.json({
                "error": true,
                "message": "value must be string",
                "data": null
            })
        }

        // type validation
        if (typeof this.type !== "string") {
            return res.json({
                "error": true,
                "message": "type must be string",
                "data": null
            })
        }



        // currencyPair validation
        if (validator.isEmpty(this.currencyPair)) {
            return res.json({
                "error": true,
                "message": "currencyPair must not be empty",
                "data": null
            })
        }

        // value validation
        if (validator.isEmpty(this.value)) {
            return res.json({
                "error": true,
                "message": "value must not be empty",
                "data": null
            })
        }

        // type validation
        if (validator.isEmpty(this.type)) {
            return res.json({
                "error": true,
                "message": "type must not be empty",
                "data": null
            })
        }





        await mmtcBuyRequest.create(data);

        try {

            // mmtc getQuoteBuy  call
            const response = await tradeMmtc.getQuoteBuy(data, res)
            await mmtcBuyResponse.create(response);

            // access data from mmtc response
            this.totalAmount = response.totalAmount
            this.quantity = response.quantity
            this.quoteValidityTime = response.quoteValidityTime
            this.taxType = response.taxType
            this.tax1Amt = response.tax1Amt
            this.tax2Amt = response.tax2Amt
            this.tax3Amt = response.tax3Amt
            this.tax1Perc = response.tax1Perc
            this.tax2Perc = response.tax2Perc
            this.preTaxAmount = response.preTaxAmount
            this.taxAmount = response.taxAmount
            this.quoteId = response.quoteId
            this.createdAt = response.createdAt


            return res.json({
                "error": false,
                "message": "success",
                "data": [response]
            });
        }
        catch (error) {
            console.log(error)

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



    //validateBuy
    static validateBuy = async (req, res) => {

        this.transactionDate = this.createdAt;
        this.transactionOrderID = this.transactionRefNo;
        this.calculationType = this.type;

        const customerRefNo = req.user._id;

        const data = {
            customerRefNo,
            calculationType: this.calculationType,
            preTaxAmount: this.preTaxAmount,
            quantity: this.quantity,
            quoteId: this.quoteId,
            tax1Amt: this.tax1Amt,
            tax2Amt: this.tax2Amt,
            transactionDate: this.transactionDate,
            transactionOrderID: this.transactionOrderID,
            totalAmount: this.totalAmount
        };

        console.log(data);


        await mmtcBuyRequest.findOneAndUpdate({ customerRefNo }, data);


        try {

            // call mmtc
            const response = await tradeMmtc.validateQuotePartnerPg(data, res)

            return res.json({
                "error": false,
                "message": "success",
                "data": [response]
            });
        }
        catch (error) {
            console.log(error)

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

    /* response : 200 Data Validated */




    //executeBuy
    static executeBuy = async (req, res) => {

        const customerRefNo = req.user._id;
        //    console.log("customerRefNo", customerRefNo)
        const billingAddressUser = await billAddressModel.findOne({ "usercustomerRefNo": customerRefNo })

        // console.log("billingAddressUser", billingAddressUser)


        const billingAddressId = billingAddressUser.id;

        // console.log(typeof billingAddressId);
        // console.log("billingAddressId", billingAddressId)

        const data = { customerRefNo, billingAddressId, calculationType: this.calculationType, preTaxAmount: this.preTaxAmount, quantity: this.quantity, quoteId: this.quoteId, tax1Amt: this.tax1Amt, tax2Amt: this.tax2Amt, transactionDate: this.transactionDate, transactionOrderID: this.transactionOrderID, totalAmount: this.totalAmount }


        try {
            // call mmtc
            const response = await tradeMmtc.executeOrderPartnerPg(data, res)
            // console.log(response)
            await mmtcBuyRequest.findOneAndUpdate({ customerRefNo }, { billingAddressId })
            return res.json({
                "error": false,
                "message": "success",
                "data": response
            });

        }
        catch (err) {
            return res.json({
                "error": true,
                "message": err,
                "data": null
            })
        }
    }



    //getOrderHistory
    static getOrderHistory = async (req, res) => {
        const customerRefNo = req.user._id;

        const { endDate, startDate } = req.body;
        const data = { ...req.body, customerRefNo };


        /* isEmpty & isString validation  */

        if (validator.isEmpty(customerRefNo)) {

            return res.json({
                "error": true,
                "message": "CustomerRefNo must not be empty",
                "data": null
            })
        }
        if (validator.isEmpty(endDate)) {

            return res.json({
                "error": true,
                "message": "End date should not be empty",
                "data": null
            })
        }

        if (validator.isEmpty(startDate)) {

            return res.json({
                "error": true,
                "message": "Start date should not be empty",
                "data": null
            })
        }

        if (typeof endDate !== 'string') {

            return res.json({
                "error": true,
                "message": "End date should be in string",
                "data": null
            })
        }

        if (typeof customerRefNo !== 'string') {

            return res.json({
                "error": true,
                "message": "CustomerRefNo should be in string",
                "data": null
            })
        }
        if (typeof startDate !== 'string') {

            return res.json({
                "error": true,
                "message": "Start date should be in string",
                "data": null
            })
        }


        console.log(data);

        // mmtc getOrderHistory call
        try {
            const response = await tradeMmtc.getOrderHistory(data, res);

            return res.json({
                "error": false,
                "message": "success",
                "data": [response]
            });
        } catch (err) {
            return res.status(500).json({
                "error": true,
                "message": err.message,
                "data": null
            });
        }
    }


    //getReddemHistory
    static getRedeemHistory = async (req, res) => {
        try {

            const customerRefNo = req.user._id;

            const { endDate, startDate } = req.body;


            /* isEmpty & isString validation  */

            if (validator.isEmpty(customerRefNo)) {

                return res.json({
                    "error": true,
                    "message": "CustomerRefNo must not be empty",
                    "data": null
                })

            }
            if (validator.isEmpty(endDate)) {

                return res.json({
                    "error": true,
                    "message": "End date should not be empty",
                    "data": null
                })

            }

            if (validator.isEmpty(startDate)) {

                return res.json({
                    "error": true,
                    "message": "Start date should not be empty",
                    "data": null
                })
            }

            if (typeof endDate !== 'string') {

                return res.json({
                    "error": true,
                    "message": "End date should be in string",
                    "data": null
                })
            }

            if (typeof customerRefNo !== 'string') {

                return res.json({
                    "error": true,
                    "message": "CustomerRefNo must not be in string",
                    "data": null
                })
            }
            if (typeof startDate !== 'string') {

                return res.json({
                    "error": true,
                    "message": "Start date should be in string",
                    "data": null
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
        } catch (err) {
            return res.status(500).json({
                "error": true,
                "message": err.message,
                "data": null
            });
        }
    }

    //getOrderDetails
    static getOrderDetails = async (req, res) => {
        //  transactionId = "BBTZRLF6CGWKJ8V";

        const data = { transactionId } = req.body;
        console.log(req);



        /* isEmpty & isString validation  */

        if (validator.isEmpty(transactionId)) {

            return res.json({
                "error": true,
                "message": "TransactionId must not be empty",
                "data": null
            })
        }

        if (validator.isEmpty(type)) {

            return res.json({
                "error": true,
                "message": "Type should not be empty",
                "data": null
            })
        }

        if (typeof transactionId !== 'string') {

            return res.json({
                "error": true,
                "message": "TransactionId should be a string",
                "data": null
            })
        }

        if (typeof type !== 'string') {

            return res.json({
                "error": true,
                "message": "Type should be a string",
                "data": null
            })
        }


        console.log(data);



        try {

            // mmtc getRedeemHistory call
            const response = await tradeMmtc.getOrderDetails(data, res);

            return res.json({
                "error": false,
                "message": "Success",
                "data": [response]
            });
        } catch (err) {
            return res.status(500).json({
                "error": true,
                "message": err.message,
                "data": null
            });
        }
    }

    //getDeliveryStatus
    static getDeliveryStatus = async (req, res) => {
        //   orderId = "BBT1fioxey5nq4Y";
        console.log(req);
        const data = { orderId } = req.body;




        // 
        if (validator.isEmpty(orderId)) {

            return res.status(500).json({
                "error": true,
                "message": "orderId must not be empty",
                "data": null
            });
        }

        if (typeof orderId !== 'string') {

            return res.status(500).json({
                "error": true,
                "message": "orderId should be in string",
                "data": null
            });
        }

        // let data = req.body;

        console.log(data);
        // let data = {...req.body, transactionRefNo }


        // const user = await mmtcBuyRequest.find({ orderId });
        // console.log(user);

        // mmtc getDeliveryStatus call
        try {
            const response = await tradeMmtc.getDeliveryStatus(data, res);
            //  console.log(response)
            return res.json({
                "error": false,
                "message": "success",
                "data": [response]
            });
        } catch (err) {
            return res.status(500).json({
                "error": true,
                "message": err.message,
                "data": [null]
            });
        }
    }
    //checkTradeStatus
    static checkTradeStatus = async (req, res) => {

        // const session = await securityMmtc.login(req, res);

        const customerRefNo = req.user._id;

        const { clientOrderID } = req.body;
        const data = { ...req.body, customerRefNo };

        if (validator.isEmpty(clientOrderID)) {
            return res.status(400).json({ message: "ClientOrderId must not be empty" });
        }

        if (validator.isEmpty(customerRefNo)) {
            return res.status(400).json({ message: "customerRefNo should not be empty" });
        }

        if (typeof customerRefNo !== 'string') {
            return res.status(400).json({ message: "customerRefNo should be in string" });
        }

        if (typeof clientOrderID !== 'string') {
            return res.status(400).json({ message: "CustomerRefNo must not be in string" });
        }

        // let data = req.body;

        console.log(data);

        // const user = await mmtcBuyRequest.find({ clientOrderID });
        // console.log(user);

        // mmtc checkTradeStatus call
        try {
            const response = await tradeMmtc.checkTradeStatus(data, res);

            return res.json({
                "error": false,
                "message": "success",
                "data": [response]
            });
        } catch (err) {
            return res.status(500).json({
                "error": true,
                "message": err.message,
                "data": [null]
            });
        }
    }


    //initiatetransfer
    static initiateTransfer = async (req, res) => {
        const srcCustomerRefNo = req.user._id;

        const {
            currencyPair, dstCustomerRefNo, dstMobileNumber, email, name, isKycRequired, channel, transactionOrderID, transactionDate, quantity
        } = req.body;

        const data = { ...req.body, srcCustomerRefNo }

        if (validator.isEmpty(dstCustomerRefNo)) {
            return res.status(400).json({ message: "dstCustomerRefNo must not be empty" });
        }

        if (validator.isEmpty(dstMobileNumber)) {
            return res.status(400).json({ message: "dstMobileNumber should not be empty" });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Invalid email address" });
        }

        if (validator.isEmpty(name)) {
            return res.status(400).json({ message: "Name should not be empty" });
        }

        if (validator.isEmpty(srcCustomerRefNo)) {
            return res.status(400).json({ message: "srcCustomerRefNo should not be empty" });
        }

        if (validator.isEmpty(isKycRequired)) {
            return res.status(400).json({ message: "kyc  should not be empty" });
        }

        if (validator.isEmpty(transactionDate)) {
            return res.status(400).json({ message: "transactionDate should not be empty" });
        }
        if (validator.isEmpty(transactionOrderID)) {
            return res.status(400).json({ message: "transactionOrderID should not be empty" });
        }
        if (validator.isEmpty(channel)) {
            return res.status(400).json({ message: "End date should not be empty" });
        }
        if (validator.isEmpty(quantity)) {
            return res.status(400).json({ message: "channel should not be empty" });
        }
        if (validator.isEmpty(currencyPair)) {
            return res.status(400).json({ message: "currencyPair should not be empty" });
        }

        if (typeof dstCustomerRefNo !== 'string') {
            return res.status(400).json({ message: "End date should be in string" });
        }

        if (typeof dstMobileNumber !== 'string') {
            return res.status(400).json({ message: "dstCustomerRefNo should be in string" });
        }

        if (typeof email !== 'string') {
            return res.status(400).json({ message: "email should be in string" });
        }
        if (typeof name !== 'string') {
            return res.status(400).json({ message: "name should be in string" });
        }
        if (typeof srcCustomerRefNo !== 'string') {
            return res.status(400).json({ message: "srcCustomerRefNo should be in string" });
        }
        if (typeof isKycRequired !== 'string') {
            return res.status(400).json({ message: "isKycRequired should be in string" });
        }
        if (typeof transactionDate !== 'string') {
            return res.status(400).json({ message: "transactionDate should be in string" });
        }
        if (typeof transactionOrderID !== 'string') {
            return res.status(400).json({ message: "transactionOrderID should be in string" });
        }
        if (typeof channel !== 'string') {
            return res.status(400).json({ message: "channel should be in string" });
        }
        if (typeof quantity !== 'string') {
            return res.status(400).json({ message: "  quantity should be in string" });
        }
        if (typeof currencyPair !== 'string') {
            return res.status(400).json({ message: "currencyPair should be in string" });
        }

        console.log(data);
        try {
            const response = await tradeMmtc.initiateTransfer(data, res);

            return res.json({
                "error": false,
                "message": "success",
                "data": [response]
            });
        } catch (err) {
            return res.status(500).json({
                "error": true,
                "message": err.message,
                "data": [null]
            });
        }
    }

    //confirmTranfer
    static confirmTransfer = async (req, res) => {
        const data = { transferId, dstCustomerRefNo, currencyPair, transactionDate } = req.body;
        console.log(req)
        if (validator.isEmpty(transferId)) {
            return res.status(400).json({ message: "transferId must not be empty" });
        }

        if (validator.isEmpty(dstCustomerRefNo)) {
            return res.status(400).json({ message: "dstCustomerRefNo should not be empty" });
        }
        if (validator.isEmpty(transactionDate)) {
            return res.status(400).json({ message: "transactionDate should not be empty" });
        }
        if (validator.isEmpty(currencyPair)) {
            return res.status(400).json({ message: "currencyPair should not be empty" });
        }

        if (typeof dstCustomerRefNo !== 'string') {
            return res.status(400).json({ message: "dstCustomerRefNo should be in string" });
        }

        if (typeof transferId !== 'string') {
            return res.status(400).json({ message: "transferId should be in string" });
        }

        if (typeof transactionDate !== 'string') {
            return res.status(400).json({ message: "transactionDate should be in string" });
        }

        if (typeof currencyPair !== 'string') {
            return res.status(400).json({ message: "currencyPair should be in string" });
        }
        console.log(data);

        try {
            const response = await tradeMmtc.confirmTransfer(data, res);

            return res.json({
                "error": false,
                "message": "success",
                "data": [response]
            });
        } catch (err) {
            return res.status(500).json({
                "error": true,
                "message": err.message,
                "data": [null]
            });
        }
    }






    //transfer
    static transfer = async (req, res) => {

        const srcCustomerRefNo = req.user._id;

        ({ channel, currencyPair, dstCustomerRefNo, quantity } = req.body);

        const transactionOrderID = uuidv4();
        const transactionDate = new Date().toString();
        //    transactionDate.toString();
        // console.log(typeof transactionDate)

        const data = { ...req.body, srcCustomerRefNo, transactionDate, transactionOrderID };
        console.log(data);



        if (validator.isEmpty(dstCustomerRefNo)) {
            return res.status(400).json({ message: "dstCustomerRefNo must not be empty" });
        }

        if (validator.isEmpty(channel)) {
            return res.status(400).json({ message: "channel should not be empty" });
        }

        if (validator.isEmpty(currencyPair)) {
            return res.status(400).json({ message: "currencyPair should not be empty" });
        }

        if (validator.isEmpty(quantity)) {
            return res.status(400).json({ message: "quantity should not be empty" });
        }

        if (validator.isEmpty(srcCustomerRefNo)) {
            return res.status(400).json({ message: "srcCustomerRefNo should not be empty" });
        }

        if (validator.isEmpty(transactionDate)) {
            return res.status(400).json({ message: "transactionDate should not be empty" });
        }
        if (validator.isEmpty(transactionOrderID)) {
            return res.status(400).json({ message: "transactionOrderID should not be empty" });
        }




        if (typeof dstCustomerRefNo !== 'string') {
            return res.status(400).json({ message: "dstCustomerRefNo should be in string" });
        }

        if (typeof srcCustomerRefNo !== 'string') {
            return res.status(400).json({ message: "srcCustomerRefNo should be in string" });
        }

        if (typeof transactionDate !== 'string') {
            return res.status(400).json({ message: "transactionDate should be in string" });
        }
        if (typeof transactionOrderID !== 'string') {
            return res.status(400).json({ message: "transactionOrderID should be in string" });
        }
        if (typeof channel !== 'string') {
            return res.status(400).json({ message: "channel should be in string" });
        }
        if (typeof quantity !== 'string') {
            return res.status(400).json({ message: "  quantity should be in string" });
        }
        if (typeof currencyPair !== 'string') {
            return res.status(400).json({ message: "currencyPair should be in string" });
        }





        try {
            const response = await tradeMmtc.transfer(data, res);

            return res.json({
                "error": false,
                "message": "success",
                "data": [response]
            });
        } catch (err) {
            return res.status(500).json({
                "error": true,
                "message": err.message,
                "data": [null]
            });
        }
    }







    //buyAndTransferPartnerPg
    static buyAndTransferPartnerPg = async (req, res) => {


        const buyCustomerRefNo = req.user._id;
        const { channel, currencyPair, transferCustomerRefNo, quantity, amount, message } = req.body;


        const billingAddressUser = await billAddressModel.findOne({ "usercustomerRefNo": buyCustomerRefNo })

        const billingAddressId = billingAddressUser.id;


        transactionOrderID = uuidv4();
        const transactionDate = new Date();

        const data = { ...req.body, buyCustomerRefNo, transactionDate, transactionOrderID, billingAddressId };
        console.log(data);



        if (validator.isEmpty(buyCustomerRefNo)) {
            return res.status(400).json({ message: "buyCustomerRefNo must not be empty" });
        }

        if (validator.isEmpty(channel)) {
            return res.status(400).json({ message: "channel should not be empty" });
        }

        if (!validator.isEmpty(currencyPair)) {
            return res.status(400).json({ message: "currencyPair should not be empty" });
        }

        if (validator.isEmpty(quantity)) {
            return res.status(400).json({ message: "quantity should not be empty" });
        }

        if (validator.isEmpty(transferCustomerRefNo)) {
            return res.status(400).json({ message: "transferCustomerRefNo should not be empty" });
        }

        if (validator.isEmpty(transactionDate)) {
            return res.status(400).json({ message: "transactionDate should not be empty" });
        }
        if (validator.isEmpty(transactionOrderID)) {
            return res.status(400).json({ message: "transactionOrderID should not be empty" });
        }

        if (validator.isEmpty(billingAddressId)) {
            return res.status(400).json({ message: "billingAddressId should not be empty" });
        }



        if (typeof buyCustomerRefNo !== 'string') {
            return res.status(400).json({ message: "buyCustomerRefNo should be in string" });
        }

        if (typeof channel !== 'string') {
            return res.status(400).json({ message: "channel should be in string" });
        }

        if (typeof transactionDate !== 'string') {
            return res.status(400).json({ message: "transactionDate should be in string" });
        }
        if (typeof transactionOrderID !== 'string') {
            return res.status(400).json({ message: "transactionOrderID should be in string" });
        }
        if (typeof transferCustomerRefNo !== 'string') {
            return res.status(400).json({ message: "transferCustomerRefNo should be in string" });
        }
        if (typeof quantity !== 'string') {
            return res.status(400).json({ message: "  quantity should be in string" });
        }
        if (typeof currencyPair !== 'string') {
            return res.status(400).json({ message: "currencyPair should be in string" });
        }




        try {
            const response = await tradeMmtc.buyAndTransferPartnerPg(data, res);

            return res.json({
                "error": false,
                "message": "success",
                "data": [response]
            });
        } catch (err) {
            return res.status(500).json({
                "error": true,
                "message": err.message,
                "data": [null]
            });
        }
    }



    static async createProfile(req, res) {

        try {

            const customerRefNo = userProfile._id;

            const userAddress = await addressModel.findOne({ "usercustomerRefNo": customerRefNo }, { new: true })
            //   console.log(userAddress)
            const userbillAddress = await billAddressModel.findOne({ "usercustomerRefNo": customerRefNo }, { new: true })
            // console.log(userbillAddress)

            const dobNew = userProfile.dob.toString().split('-').reverse().join('-') + "T00:00:00.000Z";


            /* KYC can be 'I' & KYC status can be empty {} but in delievery & billing address statecode & zip must be filled but other fields can be empty string */

            let data = {
                "fullName": userProfile.name,
                "mobileNumber": userProfile.phone,
                "emailAddress": userProfile.email,
                "dob": dobNew,
                "customerRefNo": userProfile._id,
                "kycStatus": "I",
                "kycInfo": {},
                "partner_id": process.env.partner_id,
                "isCorporate": "N",
                "type": "N",
                "gstin": "",
                "mainAccountNo": "",
                "deliveryAddress": {
                    "line1": "",
                    "line2": "",
                    "city": "",
                    "state": "",
                    "zip": 110092,
                    "country": "",
                    "mobileNumber": "",
                    "statecode": "07"
                },
                "billingAddress": {
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

            /*
            if (userAddress && userbillAddress) {

                data.deliveryAddress = userAddress;
                data.billingAddress = userbillAddress;

                // if(kyc){
                //     data.kycStatus= "Y";
                //     //kycInfo
                // }

            }
            // else{   
            //     // if(kyc){
            //     //     data.kycStatus= "Y";
            //     //     //kycInfo
            //     // }
            // }

            */

            console.log("data", data)
            const response = await userMMtc.createProfile(data, res)
            console.log("response", response)
            if (response.dgCustomerRefNo) {
                const user = await userModel.findOneAndUpdate({ "_id": customerRefNo }, { "mmtc_customer_ref": response.dgCustomerRefNo }, { new: true })
                console.log(user)
            }

            return;
        }
        catch (error) {
            console.log(error);
            return;
        }






    }




}

module.exports = tradeBuyController;


