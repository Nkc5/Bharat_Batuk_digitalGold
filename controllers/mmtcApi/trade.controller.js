
const axios = require('axios');
require('dotenv').config();
const securityMmtc = require('./security.controller.js')


const baseUrl = process.env.base_URL;




class tradeMmtc {



  //getNonExecutableQuote
  static getNonExecutableQuote = async (req, res) => {

    const { currencyPair, type } = req.body;

    try {
      const response = await axios.post(`${baseUrl}/pvt/getNonExecutableQuote`, {
        currencyPair,
        type
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      res.json(response.data);

    } catch (error) {
      console.log(error.response.data);
      throw new Error(JSON.stringify(error.response.data));
    }

  }




  //  getQuoteBuy
  static getQuoteBuy = async (req, res) => {

    const session = await securityMmtc.login(req, res);


    // const input = req.body;

    const input2 = req;

    // const data = {customerRefNo, currencyPair, transactionRefNo, value, type}

    //return input2;
    try {
      const response = await axios.post(`${baseUrl}/trade/getQuoteBuy`, input2, {
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

    const { customerRefNo, calculationType, preTaxAmount, quantity, quoteId, tax1Amt, tax2Amt, transactionDate, transactionOrderID, totalAmount } = req;


    const data2 = req;

    console.log("data2", data2)

    if (!customerRefNo || !calculationType || !preTaxAmount || !quantity || !quoteId || !tax1Amt || !tax2Amt || !transactionDate || !transactionOrderID || !totalAmount) {
      return res.json({
        error: true,
        message: 'Mandatory parameters missing',
        data: null
      })
    
    }
        

    //  cURL request to MMTC
    try {
      const response = await axios.post(`${baseUrl}/trade/validateQuotePartnerPg`, data2, {
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

    const { customerRefNo, calculationType, billingAddressId, preTaxAmount, quantity, quoteId, tax1Amt, tax2Amt, transactionDate, transactionOrderID, totalAmount } = req;
    const data = req;


    //  cURL request to MMTC
    try {
      const response = await axios.post(`${baseUrl}/trade/executeOrderPartnerPg`, data, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Cookie': `sessionId=${session.sessionId}`
        },
      }
      );

      return response.data;
    } catch (error) {
      console.log(error.response.data);
      throw new Error(JSON.stringify(error.response.data));
    }
  }





  //getQuoteSell
  static getQuoteSell = async (req, res) => {
    const session = await securityMmtc.login(req, res);

    const {
      customerRefNo,
      currencyPair,
      transactionRefNo,
      value,
      type
    } = req;

    const data = req;

    if (!customerRefNo || !currencyPair || !transactionRefNo) {
      return res.status(400).json({ error: 'Mandatory parameters missing' });
    }

    //  cURL request to MMTC
    try {
      const response = await axios.post(`${baseUrl}/trade/getQuoteSell`, data, {
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

    const { calculationType, customerRefNo, otp, payOut, paymentChannel, preTaxAmount, quantity, quoteId, tax1Amt, tax2Amt, transactionDate, transactionOrderID, totalAmount } = req;


    const data = req;
    console.log(data);


    if (!customerRefNo || !transactionOrderID) {
      return res.status(400).json({ error: 'Mandatory parameters missing' });
    }

    //  cURL request to MMTC
    try {
      const response = await axios.post(`${baseUrl}/trade/executeOrderWithPayOut`, data, {
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
    const { currencyPair, dstCustomerRefNo, dstMobileNumber, email, name, srcCustomerRefNo, isKycRequired, channel, transactionOrderID, transactionDate,
      quantity
    } = req;

    if (!currencyPair || !dstCustomerRefNo || !dstMobileNumber || !email || !name || !srcCustomerRefNo
      || !isKycRequired || !channel || !transactionOrderID || !transactionDate || !quantity) {
      return res.status(400).json({ error: 'Mandatory parameters missing' });
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


    if (!transferId || !dstCustomerRefNo || !currencyPair || !transactionDate) {
      return res.status(400).json({ error: 'Mandatory parameters missing' });
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


    // const {channel, currencyPair, dstCustomerRefNo, quantity, srcCustomerRefNo, transactionDate, transactionOrderID, message
    // } = req.body;
    //const data = req.body;

    const { channel, currencyPair, dstCustomerRefNo, quantity, srcCustomerRefNo, transactionDate, transactionOrderID, message
    } = req;

    const data = req;

    if (!channel || !currencyPair || !dstCustomerRefNo || !quantity || !srcCustomerRefNo || !transactionDate || !transactionOrderID) {
      return res.status(400).json({ error: 'Mandatory parameters missing' });
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
      return res.status(400).json({ error: 'Mandatory parameters missing' });
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
      return res.status(400).json({ error: 'Mandatory parameters missing' });
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
      console.log(error.response.data);
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
      return res.status(400).json({ error: 'Mandatory parameters missing' });
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
      return res.status(400).json({ error: 'Mandatory parameters missing' });
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
      console.log(error.response.data);
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
    console.log(customerRefNo)
    console.log(endDate)
    console.log(startDate)

    if (!customerRefNo || !endDate || !startDate) {
      return res.status(400).json({ error: 'Mandatory parameters missing' });
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

      return response.data;
    } catch (error) {
      console.log(error.response.data);
      throw new Error(JSON.stringify(error.response.data));
    }
  }

  //buyAndTransferPartnerPg
  static buyAndTransferPartnerPg = async (req, res) => {
    const session = await securityMmtc.login(req, res);

    const { buyCustomerRefNo, channel, currencyPair, transactionDate, transactionOrderID, transferCustomerRefNo, quantity, amount, message, billingAddressId } = req;

    const data = req;
    console.log(data)


    if (!buyCustomerRefNo || !channel || !currencyPair || !transactionDate || !transactionOrderID || !transferCustomerRefNo
      || !quantity || !amount || !message || !billingAddressId) {
      return res.status(400).json({ error: 'Mandatory parameters missing' });
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





}



module.exports = tradeMmtc;

