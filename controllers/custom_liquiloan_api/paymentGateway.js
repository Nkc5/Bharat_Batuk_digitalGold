

const axios = require('axios');
const liquiLoanModel = require('../../models/isInvestor.model.js')
const { format } = require('date-fns');
const crypto = require('crypto');



async function CreateInvestmentPaymentGateway(req, res) {

    const customerRefNo = req.user._id.toString();
    const currentDate = new Date();
    const formattedDate = format(currentDate, 'yyyy-MM-dd HH:mm:ss');

    console.log("customerRefNo", customerRefNo);

    const user = await liquiLoanModel.findOne({ customerRefNo }).sort({_id: -1});

    console.log("user", user);

    // let transaction_id = crypto.randomUUID().splice(5);
    let transaction_id = crypto.randomUUID().slice(0, 10);
    console.log("uuid", transaction_id);

    //`https://app.batuk.in/p2p/GetTransactionByExtTxnId?id=${transaction_id}&${user.investorId}`

    try {

        //=1709551130&2670956 
        const data = {
            timestamp: formattedDate,
            mid: process.env.MID,
            checksum: await createChecksum(user.investorId, formattedDate, "250000"),
            investor_id: user.investorId.trim(),
            transaction_amount: "250000",
            transaction_id: transaction_id,
            scheme_id:"8",
            callback_url: `http://13.201.77.26:1337/p2p/GetTransactionByExtTxnId?id=${transaction_id}_${user.investorId}`
            // callback_url: `https://app.batuk.in/p2p/GetTransactionByExtTxnId?id=${transaction_id}&${user.investorId}`
        }

        console.log("data", data);

        const response = await axios.post('https://sup-integration-stage.liquiloan.in/api/v2/CreateInvestmentPaymentGateway', data, {
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




const createChecksum = async (investor_id, timestamp, transaction_amount) => {

    const concatString = `${investor_id.trim()}||${timestamp.trim()}||${transaction_amount.trim()}`;
    const hmac = crypto.createHmac('sha256', process.env.LL_Key);
    hmac.update(concatString);
    const checksum = hmac.digest('hex');
    console.log("checksum", checksum);
    return checksum;
}



module.exports = {
    CreateInvestmentPaymentGateway
}