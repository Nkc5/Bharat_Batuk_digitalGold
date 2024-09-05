const { v4: uuidv4 } = require('uuid');
const validator = require('validator');
// const Joi = require('joi');
const tradeMmtc = require('../mmtcApi/trade.controller');
const mmtcBuyRequest = require('../../models/mmtc_buy_request.models.js');
const mmtcBuyResponse = require('../../models/mmtc_buy_response.models.js');
const redeemModel = require('../../models/mmtc_redeem.models.js');
const userModel = require('../../models/user.models.js');
const addressModel = require('../../models/address.models.js');
const userMMtc = require('../mmtcApi/user.controller')
const transferModel = require('../../models/transfer.models.js')
const buyAndTransferModel = require('../../models/buyAndTransfer.models.js')
const initiateConfirmTransferModel = require('../../models/initiateConfirmTransfer.models.js')
const NodeMailer = require('./nodeMailer.controller.js');
const fs = require('fs');




class redeemController {



    //getRedemptionCatalog
    static getRedemptionCatalog = async (req, res) => {


        try {

            // call mmtc
            var response = await tradeMmtc.getRedemptionCatalog(req, res)

            return res.json({
                "error": false,
                "message": "success",
                "data": response
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

  





  /*

{
    "customerRefNo": "{{customerRefNo}}",
    "transactionRefNo": "{{$randomUUID}}",
    "productList": [
        {
            "productId": "244790",
            "quantity": "1",
            "makingCharge": "510",
            "skuId": "AXYyCPG.975410471234"
        }
    ],
    "billingAddressId": "{{billingAddressId}}",
    "shippingAddressId": "{{billingAddressId}}",
    "totalAmount": "510",
    "preTaxAmount": "432.20",
    "taxAmount": "77.80"
}

  */

    
  //validateRedeemOrderForPartnerPg
  static validateRedeemOrderForPartnerPg = async (req, res) => {

   
    const customerRefNo = req.user._id.toString();
    const transactionRefNo = uuidv4().slice(0, 32);

    var {totalAmount, preTaxAmount, taxAmount, productId, quantity, makingCharge, skuId, billingAddressId, shippingAddressId} = req.body;


    const productList = [ {  productId, quantity, makingCharge, skuId}  ]

    console.log({ customerRefNo, transactionRefNo, productList:productList, billingAddressId, shippingAddressId, totalAmount, preTaxAmount, taxAmount});

    try {
      var response = await tradeMmtc.validateRedeemOrderForPartnerPg({ customerRefNo, transactionRefNo, productList:productList,billingAddressId, shippingAddressId, totalAmount, preTaxAmount, taxAmount}, res);

      const redeemDB = await redeemModel.create({...response, customerRefNo})

      console.log("response", response)

      return res.status(200).json({
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



/*



{
    "quoteId": "STFIPJFRIL33GVK",
    "transactionDate": "2023-04-06T07:43:43.129Z",
    "transactionOrderID": "{{$randomUUID}}"
}

*/


  
  //getNonExecutableQuote
  static executeRedeemOrderForPartnerPg = async (req, res) => {


    const customerRefNo = req.user._id.toString();
    const transactionDate = new Date().toISOString();

    var {quoteId, orderId} = req.body;

    try {
      var response = await tradeMmtc.executeRedeemOrderForPartnerPg({quoteId, transactionDate,  transactionOrderID: orderId}, res);

      console.log("response", response)

      const redeemDB = await redeemModel.findOneAndUpdate({$and: [{quoteId},{customerRefNo} ]}, response, {new: true})

     
     const newFilePath= await redeemController.generateReedeemPdfInvoice(req, res, response);
     response.invoicePDF = newFilePath;

      return res.status(200).json({
        "error": false,
        "message": "success",
        "data": [ response]
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





  

  static generateReedeemPdfInvoice = async (req, res, response) => {

    const customerRefNo = req.user._id.toString();
    var transactionId = response.orderId;

    console.log("transactionId", transactionId);

    try {


        var response = await tradeMmtc.generateRedeemPdfInvoice({ transactionId }, res)

        const folderPath = `public/uploads/invoice/${customerRefNo}/redeem`;

        // Check if the folder already exists
        if (!fs.existsSync(folderPath)) {
            // If not, create the folder
            fs.mkdirSync(folderPath);
            console.log('redeem Folder successfully created');
        }



        // Decode base64 string
        const binaryString = Buffer.from(response, 'base64');

        // Specify the path to the public/uploads folder
        const filePath = `public/uploads/invoice/${customerRefNo}/redeem/${transactionId}.pdf`;

        // Write the binary data to a file
        fs.writeFileSync(filePath, binaryString);

        console.log(`File saved at: ${filePath}`);
        
        const newFilePath = filePath.replace('public', "");

        const redeemResponse = await redeemModel.findOneAndUpdate({ orderId: transactionId }, { invoicePDF: newFilePath }, { new: true })


        console.log("redeemResponse", redeemResponse);
        


        // sending email through nodemailer;
        // await NodeMailer.toSendEmail(req, res, "redeem", req.user, "");

        return newFilePath;


    } catch (error) {
        console.log(error)
        return res.json(error);

    }
}





  //validateRedeemOrderForPartnerPg
  static validateRedeemMMTC = async (customerRefNo, data) => {

    const transactionRefNo = uuidv4().slice(0, 32);

    var {totalAmount, preTaxAmount, taxAmount, productId, quantity, makingCharge, skuId, billingAddressId, shippingAddressId} = data;


    const productList = [ {  productId, quantity, makingCharge, skuId}  ]

    console.log({ customerRefNo, transactionRefNo, productList:productList, billingAddressId, shippingAddressId, totalAmount, preTaxAmount, taxAmount});

    try {
      var response = await tradeMmtc.validateRedeemOrderForPartnerPg({ customerRefNo, transactionRefNo, productList:productList,billingAddressId, shippingAddressId, totalAmount, preTaxAmount, taxAmount}, res);

      const redeemDB = await redeemModel.create({...response, customerRefNo})

      console.log("response", response)

      return response


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





}


module.exports = redeemController;