const axios = require('axios');
const userModel = require('../../models/user.models.js');
const addressModel = require('../../models/address.models.js');
const nomineeModel = require('../../models/nominee.models.js');
const bankModel = require('../../models/bank.models.js');


const createLender = async (req, res) => {

  const _id = req.user._id;
  const customeRefNo = req.user._id.toString();

  const { } = req.body;

  const user = await userModel.findOne({ _id: _id })
  const address = await addressModel.findOne({ $and: [{ customeRefNo }, { type: 'B' }] }).sort({ _id: -1 })
  const nominee = await nomineeModel.findOne({ customeRefNo }).sort({ _id: -1 })
  const bank = await bankModel.findOne({ customeRefNo }).sort({ _id: -1 })

  console.log("in create lender")
  console.log("user", user);
  console.log("address", address);
  console.log("nominee", nominee);
  console.log("bank", bank);

  const data =
  {
    "name": user.name,
    "pan": user.pan_no,
    "dob": user.dob.split('-').reverse().join('-'),
    "mobile": user.phone,
    "email": user.email,
    "businessType": "INDIVIDUAL",
    "addresses": [
      {
        "houseNumber": "123",
        "area": address.line1,
        "city": address.city,
        "state": address.state,
        "pin": address.zip
      }
    ],
    "nominees": [
      {
        "relation": nominee.relation,
        "name": nominee.name,
        "emailId": nominee.email ? nominee.email : "",
        "phoneNumber": nominee.phone,
        "address": "123, ABC Layout, XYZ City, PIN: 111111",
        "isMinor": false
      }
    ],
    "bankDetails": [
      {
        "accountHolderName": bank.msg.name,
        "accountType": "saving",
        "accountNumber": bank.msg.account_no,
        "ifscCode": bank.msg.ifsc,
        "bankName": bank.msg.Bankname,
        "branch": bank.msg.Branchname,
        "city": "Bangalore"
      }
    ]
  }


  try {

    const response = await axios.post('https://uatapis.finzy.com/v1/lenders', data, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.finzyApikey,
        'partner-code': process.env.PartnerCode
      }
    })

    console.log("response", response.data);
    return res.status(200).json({
      error: false,
      message: "success",
      data: [
        response.data
      ]
    });


  } catch (error) {
    console.log("error", error);
    return res.status(400).json({
      error: true,
      message: error,
      data: []
    });
  }
}



module.exports = createLender;