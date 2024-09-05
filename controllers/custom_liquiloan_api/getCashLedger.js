const { format } = require('date-fns');
const crypto= require('crypto');
const axios= require('axios');
const liquiLoanModel = require('../../models/isInvestor.model.js')



module.exports = async(req, res) => {
    const customerRefNo = req.user._id.toString();

    console.log("customerRefNo", customerRefNo)

    const currentDate = new Date();
    const formattedDate = format(currentDate, 'yyyy-MM-dd HH:mm:ss');


    try {
    const user = await liquiLoanModel.findOne({customerRefNo}).sort({_id: -1});

    console.log("user", user);

    if(user){

    const data = {
        investor_id: user.investorId,
        timestamp: formattedDate,
        checksum: await createCheckSum( user.investorId, formattedDate),
        mid: process.env.MID
    }

    const response = await axios.post('https://sup-integration-stage.liquiloan.in/api/v2/GetCashLedger', data,{
        headers: {
            'Content-Type': 'application/json'
        }
    })

    
return res.status(200).json({
    error: false,
    message: "success response",
    data: [
        response.data
    ]
})


}

return res.status(400).json({
    error: true,
    message: "no investor found",
    data: []
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





async function createCheckSum(investorId, formattedDate){
    const concatString = investorId.trim()+"||"+ formattedDate.trim();

    const hmac = crypto.createHmac('sha256', process.env.LL_Key);
    hmac.update(concatString);
    const checksum = hmac.digest('hex');
    return checksum;

}