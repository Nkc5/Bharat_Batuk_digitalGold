

/*
curl --location 'https://sup-integration-stage.liquiloan.in/api/v2/GetMaturityLinkOTP' \
--data '{
    "mid":"M00103",
    "timestamp":"2022-07-11 14:57:38",
    "checksum":"12e7d073080d2b5dccdf69970ab8583cf68e2498dca11944cf41976691afc7db",
    "investor_id":362261,
    "link_token": "62cf63a03f9a7"
}
'
*/

const axios = require('axios');
const liquiLoanModel = require('../../models/isInvestor.model.js')
const crypto = require('crypto');
const { format } = require('date-fns');


/*
curl --location 'https://sup-integration-stage.liquiloan.in/api/v2/CreateMaturityAction' \
--data '{
  "mid": "M001799",
  "timestamp": "2023-12-26 14:52:42",
  "checksum": "e25eab0723e2e26ffc259002dcf77296cc59a6ee13062f6c8eda988089ee45da",
  "investor_id": "547425",
  "link_token": "6561403c8b807",
  "otp": "791828",
  "ifa_id": "1799",
  "banking_id": 254367,
  "action_json": [
    {
      "portfolio_id": "102885229",
      "maturity_type": "PrincipalAndInterestReinvestment",
      "scheme_id": "790",
      "mhp": "0",
      "payout_type": "Growth",
      "double_advantage_scheme": "No"
    }
  ]
}'
*/



const createChecksumForMaturity = async (investor_id, link_token, otp , timestamp) => {

    const concatString = `${String(investor_id).trim()}||${String(link_token).trim()}||${otp.trim()}||${timestamp.trim()}`;
    const hmac = crypto.createHmac('sha256', process.env.LL_Key);
    hmac.update(concatString);
    const checksum = hmac.digest('hex');
    console.log("checksum", checksum);
    return checksum;
}


async function CreateMaturityAction(req, res) {

    const customerRefNo = req.user._id.toString();
    const currentDate = new Date();
    const formattedDate = format(currentDate, 'yyyy-MM-dd HH:mm:ss');

    console.log("customerRefNo", customerRefNo);

    const user = await liquiLoanModel.findOne({ customerRefNo }).sort({_id: -1});

    console.log("user", user);
    const link_token="6561403a8b807";
    const otp="781828";
    
    var Checksum = await createChecksumForMaturity(user.investorId,link_token ,otp , formattedDate);

    try {

        const data ={
            mid: process.env.MID,
            timestamp: formattedDate,
            checksum: Checksum,
            investor_id: user.investorId,
            link_token: link_token,
            otp: otp,
            ifa_id: "1799",
            banking_id: Number(user.banking_id),
            action_json: [
              {
                portfolio_id: "102885229",
                maturity_type: "PrincipalAndInterestReinvestment",
                scheme_id: "421",
                mhp: "0",
                payout_type: "Growth",
                double_advantage_scheme: "No"
              }
            ]
          }

        console.log("data", data);

        const response = await axios.post('https://sup-integration-stage.liquiloan.in/api/v2/CreateMaturityAction', data, {
            headers: {
                'Content-Type': 'application/json'
            }
        })

        console.log("response", response.data);
        return res.status(200).json({
            error: false,
            message: "success",
            data: [response.data]
        })


    }
    catch (error) {
        console.log("error", error);
        return res.status(400).json({
            error: true,
            message: error,
            data: []
        })
    }

}







async function GetMaturityLinkOTP(req, res) {

    const customerRefNo = req.user._id.toString();
    const currentDate = new Date();
    const formattedDate = format(currentDate, 'yyyy-MM-dd HH:mm:ss');

    console.log("customerRefNo", customerRefNo);

    const user = await liquiLoanModel.findOne({ customerRefNo }).sort({_id: -1});

    console.log("user", user);

    try {

        const data ={
            mid:process.env.MID,
            timestamp:formattedDate,
            checksum: await createChecksum(user.investorId, '62c10f9a7', formattedDate),
            investor_id:Number(user.investorId),
            link_token: "62c10f9a7"
        }

        console.log("data", data);

        const response = await axios.post('https://sup-integration-stage.liquiloan.in/api/v2/GetMaturityLinkOTP', data, {
            headers: {
                'Content-Type': 'application/json'
            }
        })

        console.log("response", response.data);
        return res.status(200).json({
            error: false,
            message: "success",
            data: [response.data]
        })


    }
    catch (error) {
        console.log("error", error);
        return res.status(400).json({
            error: true,
            message: error,
            data: []
        })
    }

}




const createChecksum = async (investor_id, link_token, timestamp) => {

    const concatString = `${Number(investor_id)}||${link_token.trim()}||${timestamp.trim()}`;
    const hmac = crypto.createHmac('sha256', process.env.LL_Key);
    hmac.update(concatString);
    const checksum = hmac.digest('hex');
    console.log("checksum", checksum);
    return checksum;
}



module.exports = {
    CreateMaturityAction,
    GetMaturityLinkOTP
}