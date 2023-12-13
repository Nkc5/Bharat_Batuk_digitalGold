
const axios = require("axios");
const securityMmtc = require('./security.controller.js')
require('dotenv').config();


const partnerId = process.env.partner_id;
const baseUrl = process.env.base_URL;

class userMMtc {

  //create- user

  static createProfile = async (req, res) => {

    const session = await securityMmtc.login(req, res);

    const data = req;
    // console.log(data)


    try {
      const response = await axios.post(`${baseUrl}/customer/createProfile`, data,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Cookie': `sessionId=${session.sessionId}`
          }
        }
        );

      console.log("response.data", response.data)
      return response.data;
    }
    catch(error) {
      console.log("error.response.data", error.response.data);
       throw new Error(JSON.stringify(error.response.data));

    }
  }


  //getPortfolio   
  static getPortfolio = async (req, res) => {

    const session = await securityMmtc.login(req, res);

    const { customerRefNo } = req;

    if (!customerRefNo) {
      return res.status(400).json({ error: "Mandatory parameters missing" });
    }

    // Send a request to MMTC
    try {
      const response = await axios.post(`${baseUrl}/customer/getPortfolio`,
        {
          customerRefNo,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Cookie: `sessionId=${session.sessionId}`
          }
        }
      );
      return response.data

      // res.json(response.data);
    } catch (error) {
      console.log(error.response.data);
      throw new Error(JSON.stringify(error.response.data));

    
    }
  };




  ///**********    oat/getProfile
  static getProfile = async (req, res) => {
    const session = await securityMmtc.login(req, res);

    try {

      const headers = {
        mobileNumber: "9999999999",
        customerRefNo: "STF_te23nfk599",
        Accept: "application/json",
        Cookie: `sessionId=${session.sessionId}`
      };

      const response = await axios.post(`${baseUrl}/oat/getProfile`, null, { headers });
      res.json(response.data);
    } catch (error) {
      console.log(error.response.data);
      throw new Error(JSON.stringify(error.response.data));
    }
  };





  //updateprofile*****

  static updateProfile = async (req, res) => {

    const session = await securityMmtc.login(req, res);
    const payload = req;
    console.log("payload", payload)
    try {

      const headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Cookie": `sessionId=${session.sessionId}`
      };

      const response = await axios.post(`${baseUrl}/customer/updateProfile`, payload, { headers });


      // res.json(response.data);
      return response.data;
    }
    catch (error) {
      console.log(error.response.data);
      throw new Error(JSON.stringify(error.response.data));

    }
  };





  //addUpdateAddress
  static addUpdateAddress = async (req, res) => {
    const session = await securityMmtc.login(req, res);

    const data = req



    //  cURL request to MMTC
    try {
      const response = await axios.post(`${baseUrl}/pvt/addUpdateAddress`, data, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          "Cookie": `sessionId=${session.sessionId}`

        },
        
      });
      return response.data

      // res.json(response.data);
    } catch (error) {
      console.error(error)
      console.log(error.response.data);
      throw new Error(JSON.stringify(error.response.data));
    }
  };



  //active

  static active = async (req, res) => {

    const session = await securityMmtc.login(req, res)
    const { customerRefNo, phone } = req;

    // Set the request headers

    const headers = {
      'customerRefNo': customerRefNo,
      'mobileNumber': phone,
      'Accept': 'application/json',
      'Cookie': `sessionId=${session.sessionId}`,
    };
    try {
      // Make a POST request to the API          
      const response = await axios.post(`${baseUrl}/customer/activate`, null, { headers })
      //res.status(response.status).json(response.data);
      return response.data;

      // You can handle the response here
    } catch (error) {
      console.log(error.response.data);
      throw new Error(JSON.stringify(error.response.data));
    }
  };

  //inactive
  static inactive = async (req, res) => {

    const session = await securityMmtc.login(req, res)

    const { customerRefNo, phone } = req;

    // Set the request headers
    const headers = {
      'customerRefNo': customerRefNo,
      'mobileNumber': phone,
      'Accept': 'application/json',
      'Cookie': `sessionId=${session.sessionId}`,
    };
    try {

      const response = await axios.post(`${baseUrl}/customer/inactivate`, null, { headers })
      // res.status(response.status).json(response.data);
      return response.data;



    } catch (error) {
      console.log(error.response.data);
      throw new Error(JSON.stringify(error.response.data));

    }
  }


  //ispin code servieable
  static isPinCodeServiceable = async (req, res) => {
    const session = await securityMmtc.login(req, res)
    // const session = await login(req, res);
    // const pinCode = req.query.pinCode;
    const {pinCode}=req

    console.log(pinCode);
    if (!pinCode) {
      return res.status(400).json({ error: 'Mandatory parameters missing' });
    }

    try {
      const response = await axios.get(`${baseUrl}/pvt/isPinCodeServiceable?pinCode=${pinCode}`, null,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Cookie': `sessionId=${session.sessionId}`
          }
        });

      // res.json(response.data);
      return response.data
    } catch (error) {
      console.log(error.response.data);
      throw new Error(JSON.stringify(error.response.data));
    }
  }


  //getAddress

  static getAddresses = async (req, res) => {
    const session = await securityMmtc.login(req, res)


    const customerRefNo = req.body;


    if (!customerRefNo) {
      return res.status(400).json({ error: 'Mandatory parameters missing' });
    }

    try {
      const response = await axios.post(`${baseUrl}/pvt/getAddresses`,
        customerRefNo,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Cookie': `sessionId=${session.sessionId}`
          }
        });

      res.json(response.data);
    } catch (error) {
      console.log(error.response.data);
      throw new Error(JSON.stringify(error.response.data));
    }
  }

  //deleteAddress
  static deleteAddress = async (req, res) => {
    const session = await securityMmtc.login(req, res)

    const {
      id

    } = req


    if (!id) {
      return res.status(400).json({ error: 'Mandatory parameters missing' });
    }


    //  cURL request to MMTC
    try {
      const response = await axios.post(`${baseUrl}/pvt/deleteAddress`, {
        id
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Cookie': `sessionId=${session.sessionId}`

        }
      });
      return response.data

      //res.json(response.data);
    } catch (error) {
      console.log(error.response.data);
      throw new Error(JSON.stringify(error.response.data));
     
    }
  };

  //XAU 

  static XAU = async (req, res) => {
    // console.log(session)
    // const { timeFrame } = req.body;
    // const value = req.body

    //   const data = { "timeFrame": "1W" }
    const session = await securityMmtc.login(req, res)

    const { timeFrame } = req;
    const value = req;
    console.log(timeFrame)
    console.log(req)

    if (!timeFrame) {
      return res.status(400).json({ error: 'Mandatory parameters missing' });
    }

    //  cURL request to MMTC
    try {
      const response = await axios.post(`${baseUrl}/price/XAU/INR`, value, {
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

  // XAG//Silver

  static XAG = async (req, res) => {
    const session = await securityMmtc.login(req, res)

    //  const { timeFrame } = req.body;
    // const value = req.body

    // const data = { "timeFrame": "1W" }

    const { timeFrame } = req;
    const value = req;
    console.log(value)


    if (!timeFrame) {
      return res.status(400).json({ error: 'Mandatory parameters missing' });
    }

    //  cURL request to MMTC
    try {
      const response = await axios.post(`${baseUrl}/price/XAG/INR`, value, {
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




  //validate
  static validate = async (req, res) => {
    const session = await securityMmtc.login(req, res);

    const { customerRefNo, phone } = req;


    //  cURL request to MMTC
    try {
      const response = await axios.post(`${baseUrl}/customer/validate`, null, {
        headers: {
          'customerRefNo': customerRefNo,
          'mobileNumber': phone,
          'Accept': 'application/json',
          "Cookie": `sessionId=${session.sessionId}`,
        }

      });


      // res.json(response.data);
      return response.data;

    } catch (error) {
      console.log(error.response.data);
      throw new Error(JSON.stringify(error.response.data));

    }
  };






  //invalidate
  static inValidate = async (req, res) => {
    const session = await securityMmtc.login(req, res);

    const { customerRefNo, phone } = req;



    //  cURL request to MMTC
    try {
      const response = await axios.post(`${baseUrl}/customer/invalidate`, null, {
        headers: {
          "customerRefNo": customerRefNo,
          'mobileNumber': phone,
          'Accept': 'application/json',
          "Cookie": `sessionId=${session.sessionId}`,

        }

      });


      // res.json(response.data);
      return response.data;

    } catch (error) {
      console.log(error.response.data);
      throw new Error(JSON.stringify(error.response.data));

      
    }
  };




}


module.exports = userMMtc;