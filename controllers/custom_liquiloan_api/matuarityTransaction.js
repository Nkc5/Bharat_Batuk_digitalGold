
const axios = require('axios');
const liquiLoanModel = require('../../models/isInvestor.model.js')
const { format } = require('date-fns');
const crypto = require('crypto');



 module.exports = GetInvestorMaturityTransactions = async (req, res) => {
    const customeRefNo = req.user._id.toString();
    const user = await liquiLoanModel.findOneAndUpdate({customeRefNo});
    console.log("user", user);
    const InvestorId= user.investorId ;
    console.log("InvestorId",InvestorId)
    
    const currentDate = new Date();
    const formattedDate = format(currentDate, 'yyyy-MM-dd HH:mm:ss');
    const NumberofDays="5";
    const checksome= await createChecksum(InvestorId, NumberofDays, formattedDate);
    console.log("checksum",checksome)


    try {
    
    const data = { 
        "mid": process.env.MID,
        "timestamp":formattedDate,
        "checksum": checksome,
        "mumber_of_days":NumberofDays,
        "action_taken": "yes",
        "investor_id": InvestorId
     }

     const response = await axios.post('https://sup-integration-stage.liquiloan.in/api/v2/GetInvestorMaturityTransactions', data, {
        headers:{
            'Content-Type': 'application/json'
        }
     })

     console.log("response", response);

     return res.status(200).json({
        error: true,
        message: "success",
        data: [
            response.data
        ]
    })

         
    } 
    catch(error) {
        console.log("error", error);
        return res.status(400).json({
            error: true,
            message: error,
            data: []
        })
    }




}


async function createChecksum(InvestorId, mumber_of_days, timestamp){
    console.log("nitish")
    // const concatString = `${String(InvestorId).trim()}||${String(mumber_of_days).trim()}||${timestamp.trim()}`
    const concatString = `${InvestorId.trim()}||${String(mumber_of_days).trim()}||${timestamp.trim()}`

    const hmac = crypto.createHmac('sha256', process.env.LL_Key);
    hmac.update(concatString);
    const checksum = hmac.digest('hex');
    console.log("checksum", checksum);
    return checksum;

}






