
const { v4: uuidv4 } = require('uuid');
const validator = require('validator');
// const Joi = require('joi');
const tradeMmtc = require('../mmtcApi/trade.controller');
const mmtcBuyRequest = require('../../models/mmtc_buy_request.models.js');
const mmtcBuyResponse = require('../../models/mmtc_buy_response.models.js');
const userModel = require('../../models/user.models.js');
const addressModel = require('../../models/address.models.js');
const userMMtc = require('../mmtcApi/user.controller')
const transferModel = require('../../models/transfer.models.js')
const buyAndTransferModel = require('../../models/buyAndTransfer.models.js')
const initiateConfirmTransferModel = require('../../models/initiateConfirmTransfer.models.js')
const NodeMailer = require('./nodeMailer.controller.js');
const aes256 = require('aes256');
const axios = require('axios')
const crypto = require('crypto');




class paymentController {






    //executeBuy
    static onePay = async (req, res) => {

        var key = 'Ig9qY7IC8kc9gB2SS0Ve8TA5ZQ9nT3rH';


        var _1PayPost2 = "https://pa-preprod.1pay.in/payment/payprocessorV2";
      

        const ENC_KEY = "Ig9qY7IC8kc9gB2SS0Ve8TA5ZQ9nT3rH"; 
        const IV = "Ig9qY7IC8kc9gB2S"; 

      
        var encrypt = ((val) => {
            let cipher = crypto.createCipheriv('aes-256-cbc', ENC_KEY, IV);
            let encrypted = cipher.update(val, 'utf8', 'base64');
            encrypted += cipher.final('base64');
            return encrypted;
        });
       

        var requestJsonObj = {
            merchantId: "M00006192",
            apiKey: "Ig9qY7IC8kc9gB2SS0Ve8TA5ZQ9nT3rH",
            txnId: "123456776687689",//uuidv4(),
            amount: "100.00",
            dateTime: "2023-12-26 17:07:00",
            custMobile: "9188990011",
            custMail: "nitish@wmail.com",
            channelId: "0",
            txnType: "DIRECT",
            returnURL: "http://13.233.194.174:1337/onepayresponse/paynowresponse",
            productId: "DEFAULT",
            isMultiSettlement: "0",
            udf1: "NA",
            udf2: "NA",
            udf3: "NA",
            udf4: "NA",
            udf5: "NA",
            udf6: "NA",
            instrumentId: "UPI",
            cardDetails: "NA", //customer VPA
            cardType: "NA" //UPI

        };
        
    
        console.log("json", JSON.stringify(requestJsonObj));
        console.log("\n")
       console.log("encrypt", encrypt(JSON.stringify(requestJsonObj)))
       

        axios.post(_1PayPost2, {
                merchantId: "M00006192",
                reqData: encrypt(JSON.stringify(requestJsonObj))
            })
            .then(resp => {
                console.log(`statusCode: ${resp.status}`)
                console.log(resp);
                return res.send(resp.data);
            })
            .catch(error => {
                console.error(error)
            })

       
    }


    static paynowresponse = async (req, res) => {

        const { respData, pgid, merchantId} = req.body;

        console.log("req.body", req.body)
         const ENC_KEY = "Ig9qY7IC8kc9gB2SS0Ve8TA5ZQ9nT3rH"; 
        const IV = "Ig9qY7IC8kc9gB2S"; 

         var decrypt = ((encrypted) => {
            let decipher = crypto.createDecipheriv('aes-256-cbc', ENC_KEY, IV);
            let decrypted = decipher.update(encrypted, 'base64', 'utf8');
            return (decrypted + decipher.final('utf8'));
        });

         console.log(decrypt(respData));
        

        return res.json({
            "error": false,
            "message": "success",
            "data": [JSON.parse(decrypt(respData))]
        });






    }





}

module.exports = paymentController;


