


const axios = require('axios');
const liquiLoanModel = require('../../models/isInvestor.model.js')
const crypto = require('crypto');
const { format } = require('date-fns');





async function WithdrawMoneyInvestor(req, res) {

    const customerRefNo = req.user._id.toString();
    const currentDate = new Date();
    const formattedDate = format(currentDate, 'yyyy-MM-dd HH:mm:ss');

    const user = await liquiLoanModel.findOne({ customerRefNo }).sort({_id: -1});
    const scheme_id=428;
    console.log("scheme_id",scheme_id)

    console.log("user", user);

    const data = {
        mid: process.env.MID,
        timestamp: formattedDate,
        checksum: await createChecksum(user.investorId, formattedDate, '200000'),
        investor_id: user.investorId,
        banking_id: user.banking_id,
        scheme_id: scheme_id,
        transaction_id: "HDFC234517786",
        transaction_amount: "200000",
        dry_run: "N"
    }

    const response = await axios.post(`https://sup-integration-stage.liquiloan.in/api/v2/WithdrawMoneyInvestor`, data, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
return response.data;


}




const createChecksum = async (InvestorId, Timestamp, TransactionAmount) => {

    const concatString = `${InvestorId.trim()}||${Timestamp.trim()}||${TransactionAmount.trim()}`;
    const hmac = crypto.createHmac('sha256', process.env.LL_Key);
    hmac.update(concatString);
    const checksum = hmac.digest('hex');
    return checksum;
}



module.exports = {
    WithdrawMoneyInvestor
}