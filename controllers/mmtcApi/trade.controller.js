
const axios = require('axios');
require('dotenv').config();
const securityMmtc = require('./security.controller.js')


const baseUrl = process.env.base_URL;




class tradeMmtc {



  
static vpaValidate = async(req, res)=>{

  const session = await securityMmtc.login(req, res);

  var {vpaId} = req;

  console.log("req", req)
  try {
      
  
      var response = await axios.post('https://cemuat.mmtcpamp.com/pvt/checkValidateVpaId', {vpaId},
      {
          headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Cookie': `sessionId=${session.sessionId}`
            }
      })
  
      console.log("response mmtc", response)
      console.log("response mmtc data", response.data)

      return response.data;

  
  } catch (error) {
    console.log(error);
    throw new Error(JSON.stringify(error));
  }
  
  
  
  }
       
  



  
  // buy invoice pdf
  
static generateBuyPdfInvoice = async(req, res)=>{

  const session = await securityMmtc.login(req, res);

  const {transactionId} = req;

  console.log("req", req)
  
  try {
      
  
      var response = await axios.post('https://cemuat.mmtcpamp.com/pvt/generateBuyPdfInvoice', {transactionId},
      {
          headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Cookie': `sessionId=${session.sessionId}`
            }
      })
  
    

      return response.data;

  
  } catch (error) {
    console.log(error);
    throw new Error(JSON.stringify(error));
  }
  
  
  
  }
   







  // sell invoice pdf
  
static generateSellPdfInvoice = async(req, res)=>{

  const session = await securityMmtc.login(req, res);

  const {transactionId} = req;

  console.log("req", req)

  try {
      
  
      const response = await axios.post( 'https://cemuat.mmtcpamp.com/pvt/generateSellPdfInvoice', {transactionId},
      {
          headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Cookie': `sessionId=${session.sessionId}`
            }
      })
  
    
      return response.data;

  
  } catch (error) {
    console.log(error);
    throw new Error(JSON.stringify(error));
  }
  
  
  
  }
   


  

  // sell invoice pdf
  
static generateRedeemPdfInvoice = async(req, res)=>{

  const session = await securityMmtc.login(req, res);

  const {transactionId} = req;

  console.log("req", req)

  try {
      
  
      const response = await axios.post( 'https://cemuat.mmtcpamp.com/pvt/generateRedeemPdfInvoice', {transactionId},
      {
          headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Cookie': `sessionId=${session.sessionId}`
            }
      })
  
    
      return response.data;

  
  } catch (error) {
    console.log(error);
    throw new Error(JSON.stringify(error));
  }
  
  
  
  }
   




  //getNonExecutableQuote
  static getNonExecutableQuote = async (req, res) => {

    var { currencyPair, type } = req;

    // console.log("req", req)

    if(!currencyPair || !type){
      return res.status(400).json({
        error: true,
        message: 'Mandatory parameters missing',
        data: []
      })
    }


    try {
      var response = await axios.post(`${baseUrl}/pvt/getNonExecutableQuote`, {
        currencyPair,
        type
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return response.data;

    } catch (error) {
      console.log(error.response.data);
      throw new Error(JSON.stringify(error.response.data));
    }

  }




  //  getQuoteBuy
  static getQuoteBuy = async (req, res) => {

    const session = await securityMmtc.login(req, res);

    var {currencyPair, value, type, transactionRefNo, customerRefNo} = req;
    console.log("getQuoteBuy req:", req);

    if(!currencyPair || !value || !type || !transactionRefNo  || !customerRefNo){
      return res.status(400).json({
        error: true,
        message: 'Mandatory parameters missing',
        data: []
      })
    }

    var input2 = req;

    // const data = {customerRefNo, currencyPair, transactionRefNo, value, type}

    //return input2;
    try {
      var response = await axios.post(`${baseUrl}/trade/getQuoteBuy`, input2, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Cookie': `sessionId=${session.sessionId}`
        }
      });


      // res.json(response.data);
      return response.data;

    } catch (error) {
      console.log(error.response.data);
      throw new Error(JSON.stringify(error.response.data));
    }
  }





  //  validateQuotePartnerPg
  static validateQuotePartnerPg = async (req, res) => {

    const session = await securityMmtc.login(req, res);

    var { customerRefNo, calculationType, preTaxAmount, quantity, quoteId, tax1Amt, tax2Amt, transactionDate, transactionOrderID, totalAmount } = req;


    var data2 = req;

    console.log("data2", data2)

    if (!customerRefNo || !calculationType || !preTaxAmount || !quantity || !quoteId || !tax1Amt || !tax2Amt || !transactionDate || !transactionOrderID || !totalAmount) {
      return res.status(400).json({
        error: true,
        message: 'Mandatory parameters missing',
        data: []
      })
    
    }
        

    //  cURL request to MMTC
    try {
      var response = await axios.post(`${baseUrl}/trade/validateQuotePartnerPg`, data2, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Cookie': `sessionId=${session.sessionId}`
        },

      }
      )

      // res.json(response.data);

      return response.data;

    } catch (error) {
      console.log(error.response.data);
      throw new Error(JSON.stringify(error.response.data));
    }


  }



  //  executeOrderPartnerPg
  static executeOrderPartnerPg = async (req, res) => {

    const session = await securityMmtc.login(req, res);

    var { customerRefNo, calculationType, billingAddressId, preTaxAmount, quantity, quoteId, tax1Amt, tax2Amt, transactionDate, transactionOrderID, totalAmount } = req;

    if (!customerRefNo || !calculationType || !billingAddressId || !preTaxAmount || !quantity || !quoteId || !tax1Amt || !tax2Amt || !transactionDate || !transactionOrderID || !totalAmount) {
      return res.status(400).json({
        error: true,
        message: 'Mandatory parameters missing',
        data: []
      })
    
    }

    var data = req;


    //  cURL request to MMTC
    try {
      var response = await axios.post(`${baseUrl}/trade/executeOrderPartnerPg`, data, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Cookie': `sessionId=${session.sessionId}`
        },
      }
      );

      return response.data;
    } catch (error) {
      console.log("executeOrderPartnerPg",error.response.data);
      throw new Error(JSON.stringify(error.response.data));
    }
  }




  
  //  validateQuotePartnerPg
  static validateOrderAndExecute = async (req, res) => {

    const session = await securityMmtc.login(req, res);

    var { customerRefNo,billingAddressId, calculationType, preTaxAmount, quantity, quoteId, tax1Amt, tax2Amt, transactionDate, transactionOrderID, totalAmount } = req;


    var data2 = req;

    console.log("data2", data2)

    if (!customerRefNo || !calculationType || !billingAddressId || !preTaxAmount || !quantity || !quoteId || !tax1Amt || !tax2Amt || !transactionDate || !transactionOrderID || !totalAmount) {
      return res.status(400).json({
        error: true,
        message: 'Mandatory parameters missing',
        data: []
      })
    
    }
        

    //  cURL request to MMTC
    try {
      var response = await axios.post(`${baseUrl}/trade/validateOrderAndExecute`, data2, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Cookie': `sessionId=${session.sessionId}`
        },

      }
      )

      // res.json(response.data);

      return response.data;

    } catch (error) {
      console.log(error.response.data);
      throw new Error(JSON.stringify(error.response.data));
    }


  }




  

  //  executeOrderPartnerPg
  static executeOrderWithPayIn = async (req, res) => {

    const session = await securityMmtc.login(req, res);

    var { calculationType, payIn, transactionDate, preTaxAmount, quantity, quoteId, tax1Amt, tax2Amt, totalAmount, billingAddressId, customerRefNo, transactionOrderID, rezorpayTid } = req;

    // if (!customerRefNo || !calculationType || !billingAddressId || !preTaxAmount || !quantity || !quoteId || !tax1Amt || !tax2Amt || !transactionDate || !transactionOrderID || !totalAmount) {
    //   return res.status(400).json({
    //     error: true,
    //     message: 'Mandatory parameters missing',
    //     data: []
    //   })
    
    // }

    var data = req;

    console.log("req", req)


    //  cURL request to MMTC
    try {
      var response = await axios.post(`${baseUrl}/trade/executeOrderWithPayIn`, data, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Cookie': `sessionId=${session.sessionId}`
        },
      }
      );

      return response.data;
    } catch (error) {
      console.log("executeOrderWithPayIn",error.response.data);
      throw new Error(JSON.stringify(error.response.data));
    }
  }






  //getQuoteSell
  static getQuoteSell = async (req, res) => {
    const session = await securityMmtc.login(req, res);

    var {
      customerRefNo,
      currencyPair,
      transactionRefNo,
      value,
      type
    } = req;

    var data = req;

    if (!customerRefNo || !currencyPair || !transactionRefNo || !value || !type) {
      return res.status(400).json({
        error: true,
        message: 'Mandatory parameters missing',
        data: []
      })
    }

    //  cURL request to MMTC
    try {
      var response = await axios.post(`${baseUrl}/trade/getQuoteSell`, data, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Cookie': `sessionId=${session.sessionId}`
        }
      });



      return response.data;

    } catch (error) {
      console.log(error.response.data);
      throw new Error(JSON.stringify(error.response.data));
    }
  }




  //executeOrderWithPayOut
  static executeOrderWithPayOut = async (req, res) => {
    const session = await securityMmtc.login(req, res);

    var { calculationType, customerRefNo, otp, payOut, paymentChannel, preTaxAmount, quantity, quoteId, tax1Amt, tax2Amt, transactionDate, transactionOrderID, totalAmount } = req;


    var data = req;
    console.log(data);


    if (!calculationType || !customerRefNo  || !preTaxAmount || !quantity || !quoteId || !tax1Amt || !tax2Amt || !transactionDate || !transactionOrderID || !totalAmount) {
      return res.status(400).json({
        error: true,
        message: 'Mandatory parameters missing',
        data: []
      })
    }

    //  cURL request to MMTC
    try {
      var response = await axios.post(`${baseUrl}/trade/executeOrderWithPayOut`, data, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Cookie': `sessionId=${session.sessionId}`
        }
      });

      console.log(response.data);
      return response.data;

    } catch (error) {
      console.log(error.response.data);
      throw new Error(JSON.stringify(error.response.data));

    }
  }



  //initiateTransfer
  static initiateTransfer = async (req, res) => {
    const session = await securityMmtc.login(req, res);
    const { currencyPair, dstCustomerRefNo, dstMobileNumber, email, name, srcCustomerRefNo, isKycRequired, channel, transactionOrderID, transactionDate,quantity } = req;

    // console.log("req", req )

    if (!currencyPair || !dstCustomerRefNo || !dstMobileNumber || !email || !name || !srcCustomerRefNo
       || !channel || !transactionOrderID || !transactionDate || !quantity) {
        return res.status(400).json({
          error: true,
          message: 'Mandatory parameters missing',
          data: []
        })
    }

    try {
      const response = await axios.post(`${baseUrl}/trade/initiateTransfer`, {
        currencyPair, dstCustomerRefNo, dstMobileNumber, email, name, srcCustomerRefNo, isKycRequired, channel, transactionOrderID,
        transactionDate, quantity
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Cookie': `sessionId=${session.sessionId}`
        }
      });

      return response.data;
    }

    catch (error) {
      console.log(error.response.data);
      throw new Error(JSON.stringify(error.response.data));

    }
  };



  //confirmTransfer
  static confirmTransfer = async (req, res) => {
    const session = await securityMmtc.login(req, res);
    const { transferId, dstCustomerRefNo, currencyPair, transactionDate } = req;

    // console.log("req", req)

    if (!transferId || !dstCustomerRefNo || !currencyPair || !transactionDate) {
      return res.status(400).json({
        error: true,
        message: 'Mandatory parameters missing',
        data: []
      })
    }


    //  cURL request to MMTC
    try {
      const response = await axios.post(`${baseUrl}/trade/confirmTransfer`, {
        transferId,
        dstCustomerRefNo,
        currencyPair,
        transactionDate,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Cookie': `sessionId=${session.sessionId}`

        }
      });

      return response.data;
    } catch (error) {
      console.log(error.response.data);
      throw new Error(JSON.stringify(error.response.data));
    }
  };




  //Transfer


  static transfer = async (req, res) => {

    const session = await securityMmtc.login(req, res);

    const { channel, currencyPair, dstCustomerRefNo, quantity, srcCustomerRefNo, transactionDate, transactionOrderID, message
    } = req;

    const data = req;

    if (!channel || !currencyPair || !dstCustomerRefNo || !quantity || !srcCustomerRefNo || !transactionDate || !transactionOrderID) {
      return res.status(400).json({
        error: true,
        message: 'Mandatory parameters missing',
        data: []
      })
    }

    //  cURL request to MMTC
    try {
      const response = await axios.post(`${baseUrl}/trade/transfer`, data, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Cookie': `sessionId=${session.sessionId}`
        }
      });

      // res.json(response.data);
      return response.data;

    } catch (error) {
      console.log(error.response.data);
      throw new Error(JSON.stringify(error.response.data));
    }
  }



  //getDeliverystatus

  static getDeliveryStatus = async (req, res) => {

    const session = await securityMmtc.login(req, res);
    const {
      orderId
    } = req;
    // console.log(req.body);
    if (!orderId) {
      return res.status(400).json({
        error: true,
        message: 'Mandatory parameters missing',
        data: []
      })
    }
    // console.log(orderId)
    //  cURL request to MMTC
    try {
      const response = await axios.post(`${baseUrl}/trade/getDeliveryStatus`, {
        orderId
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Cookie': `sessionId=${session.sessionId}`
        }
      });

      return response.data;
    } catch (error) {
      console.log(error.response.data);
      throw new Error(JSON.stringify(error.response.data));
    }
  }

  //getOrderDetails

  static getOrderDetails = async (req, res) => {
    const session = await securityMmtc.login(req, res);

    const {
      transactionId,
      type

    } = req;

    if (!transactionId || !type) {
      return res.status(400).json({
        error: true,
        message: 'Mandatory parameters missing',
        data: []
      })
    }

    //  cURL request to MMTC
    try {
      const response = await axios.post(`${baseUrl}/trade/getOrderDetails`, {
        transactionId,
        type
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Cookie': `sessionId=${session.sessionId}`
        }
      });

      return response.data;
    } catch (error) {
      console.log("getOrderDetails",error.response.data);
      throw new Error(JSON.stringify(error.response.data));

    }
  }

  //checkTradeStatus  

  static checkTradeStatus = async (req, res) => {
    const session = await securityMmtc.login(req, res);
    const {
      clientOrderID,
      customerRefNo
    } = req;

    if (!clientOrderID || !customerRefNo) {
      return res.status(400).json({
        error: true,
        message: 'Mandatory parameters missing',
        data: []
      })
    }


    //     //  cURL request to MMTC
    try {
      const response = await axios.post(`${baseUrl}/trade/checkTradeStatus`, {
        clientOrderID,
        customerRefNo
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Cookie': `sessionId=${session.sessionId}`
        }
      });


      return response.data;
    } catch (error) {
      console.log(error.response.data);
      throw new Error(JSON.stringify(error.response.data));
    }
  };




  //getReedemHistory
  static getRedeemHistory = async (req, res) => {
    const session = await securityMmtc.login(req, res);
    const { customerRefNo, endDate, startDate } = req;

    if (!customerRefNo || !endDate || !startDate) {
      return res.status(400).json({
        error: true,
        message: 'Mandatory parameters missing',
        data: []
      })
    }

    //  cURL request to MMTC
    try {
      const response = await axios.post(`${baseUrl}/trade/getRedeemHistory`, {

        customerRefNo,
        endDate,
        startDate
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Cookie': `sessionId=${session.sessionId}`
        }
      });

      return response.data;
    } catch (error) {
      console.log("getRedeemHistory",error.response.data);
      throw new Error(JSON.stringify(error.response.data));
    }
  }

  //getOrderHistory
  static getOrderHistory = async (req, res) => {
    const session = await securityMmtc.login(req, res);
    const {

      customerRefNo,
      endDate,
      startDate

    } = req;

    console.log("req", req)

   

    if (!customerRefNo || !endDate || !startDate) {
      return res.status(400).json({
        error: true,
        message: 'Mandatory parameters missing',
        data: []
      })
    }

    //  cURL request to MMTC
    try {
      const response = await axios.post(`${baseUrl}/trade/getOrderHistory`, {
        customerRefNo,
        endDate,
        startDate

      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Cookie': `sessionId=${session.sessionId}`
        }
      });

      console.log("mmtcresponse", response.data);

      return response.data;
    } catch (error) {
      console.log("getOrderHistory",error.response.data);
      throw new Error(JSON.stringify(error.response.data));
    }
  }

  //buyAndTransferPartnerPg
  static buyAndTransferPartnerPg = async (req, res) => {
    const session = await securityMmtc.login(req, res);

    const { buyCustomerRefNo, channel, currencyPair, transactionDate, transactionOrderID, transferCustomerRefNo, quantity, amount, message, billingAddressId } = req;

    const data = req;
    // console.log(data)


    if (!buyCustomerRefNo || !channel || !currencyPair || !transactionDate || !transactionOrderID || !transferCustomerRefNo
      || !quantity || !amount || !billingAddressId) {
        return res.status(400).json({
          error: true,
          message: 'Mandatory parameters missing',
          data: []
        })
    }

    //  cURL request to MMTC
    try {
      const response = await axios.post(`${baseUrl}/trade/buyAndTransferPartnerPg`, data, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Cookie': `sessionId=${session.sessionId}`
        }
      });

      // res.json(response.data);
      return response.data;

    } catch (error) {
      console.log(error.response.data);
      throw new Error(JSON.stringify(error.response.data));

    }
  }








  /*                    Redeem API    */

  

  //getNonExecutableQuote
  static getRedemptionCatalog = async (req, res) => {

    var session = await securityMmtc.login(req, res);
   


    try {
      var response = await axios.post(`${baseUrl}/redeem/getRedemptionCatalog`, null, {
        headers: {
         
          'Accept': 'application/json',
          'Cookie': `sessionId=${session.sessionId}`
        }
      });

      console.log("response", response.data)

      return response.data;

    } catch (error) {
      console.log(error.response.data);
      throw new Error(JSON.stringify(error.response.data));
    }

  }






  
  //validateRedeemOrderForPartnerPg
  static validateRedeemOrderForPartnerPg = async (req, res) => {

    var session = await securityMmtc.login(req, res);
    
    var data = req;


    try {
      var response = await axios.post(`${baseUrl}/redeem/validateRedeemOrderForPartnerPg`, data, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Cookie': `sessionId=${session.sessionId}`
        }
      });

      console.log("response", response)

      return response.data;

    } catch (error) {
      console.log(error.response.data);
      throw new Error(JSON.stringify(error.response.data));
    }

  }






    
  ///executeRedeemOrderForPartnerPg
  static executeRedeemOrderForPartnerPg = async (req, res) => {

    var session = await securityMmtc.login(req, res);
    
    var data = req;


    try {
      var response = await axios.post(`${baseUrl}/redeem/executeRedeemOrderForPartnerPg`, data, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Cookie': `sessionId=${session.sessionId}`
        }
      });

      console.log("response", response)

      return response.data;

    } catch (error) {
      console.log(error.response.data);
      throw new Error(JSON.stringify(error.response.data));
    }

  }






  //validateRedeemOrderForPartnerPg
  static validateRedeemMMTC = async (req, res, data) => {

    console.log("data", data);

    var session = await securityMmtc.login(req, res);
    
    try {
      var response = await axios.post(`${baseUrl}/redeem/validateRedeemOrderForPartnerPg`, data, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Cookie': `sessionId=${session.sessionId}`
        }
      });

      return response.data;

    } catch (error) {
      console.log(error.response.data);
      throw new Error(error.response.data.reason);
    }

  }







}



module.exports = tradeMmtc;

