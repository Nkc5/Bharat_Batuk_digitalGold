

const axios = require('axios');
const { userAugmontModel, tokenAugmontModel } = require('../../models/augmont/user_augmont.js');
const goldRates = require('../../models/augmont/Gold_silver_rates.js');
const bankModel = require('../../models/bank.models.js');
const { sellModel } = require('../../models/augmont/sell_response.js');
const sellRequestModel = require('../../models/augmont/sell_request.js');


const sell = async (req, res) => {

    const customerRefNo = req.user._id.toString();

    const { metalType, quantity, amount } = req.body;


    const user = await userAugmontModel.findOne({ customerRefNo }).sort({ _id: -1 });
    const token = await tokenAugmontModel.findOne({}).sort({ _id: -1 });
    const bank = await bankModel.findOne({ customerRefNo }).sort({ _id: -1 });
    const sellReq = await sellRequestModel.findOne({ customerRefNo }).sort({ _id: -1 });


    console.log("bank", bank);

    try {

        const formData = new FormData();

        formData.append('uniqueId', user.uniqueId);
        formData.append('lockPrice', sellReq.pricePerGram);
        formData.append('blockId', sellReq.blockId);
        formData.append('metalType', metalType);

        quantity ? formData.append('quantity', quantity) : formData.append('amount', amount)
        formData.append('merchantTransactionId', sellReq.merchantTransactionId);
        formData.append('userBank[accountName]', bank.msg.name);
        formData.append('userBank[accountNumber]', bank.msg.account_no);
        formData.append('userBank[ifscCode]', bank.msg.ifsc);
        // formData.append('userBank[ifscCode]', 'SBIN0BHAESE');


        console.log("formData", formData);

        const response = await axios.post(`${process.env.Augmont_URL}/merchant/v1/sell`, formData, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token.token_augmont}`
            }
        })

        const dbResponse = await sellModel.create({ customerRefNo, ...response.data });
        console.log("dbResponse", dbResponse)

        return res.status(200).json({
            error: false,
            message: 'succes',
            data: [{
                ...response.data,
                type: "sell"
            }]
        })


    } catch (error) {
        console.log("error", error.response.data);
        console.log("error", error.response.data.errors);

        return res.status(400).json({
            error: true,
            statusCode: error.response.data.statusCode,
            message: error.response.data.errors,
            data: []
        })
    }
}




const merchanSellList = async (req, res) => {

    const customerRefNo = req.user._id.toString();
    const user = await userAugmontModel.findOne({ customerRefNo }).sort({ _id: -1 });
    const token = await tokenAugmontModel.findOne({}).sort({ _id: -1 });


    try {

        const response = await axios.get(`${process.env.Augmont_URL}/merchant/v1/${user.uniqueId}/sell`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token.token_augmont}`
            }
        })
        return response.data;

        return res.status(200).json({
            error: false,
            message: 'succes',
            data: [response.data]
        })


    } catch (error) {
        console.log("error", error.response.data);

        return res.status(400).json({
            error: true,
            statusCode: error.response.data.statusCode,
            message: error.response.data.message,
            data: []
        })
    }
}





const getSellInfo = async (req, res) => {

    const customerRefNo = req.user._id.toString();
    // const {sell$merchant$txn$id} = req.params;
    const { sellMerchantTxnId } = req.params;
    console.log("req.params", req.params)

    const user = await userAugmontModel.findOne({ customerRefNo }).sort({ _id: -1 });
    const token = await tokenAugmontModel.findOne({}).sort({ _id: -1 });


    try {

        const response = await axios.get(`${process.env.Augmont_URL}/merchant/v1/sell/${sellMerchantTxnId}/${user.uniqueId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token.token_augmont}`
            }
        })

        return res.status(200).json({
            error: false,
            message: 'succes',
            data: [response.data]
        })


    } catch (error) {
        console.log("error", error);
        console.log("error", error.response.data);

        return res.status(400).json({
            error: true,
            statusCode: error.response.data.statusCode,
            message: error.response.data.message,
            data: []
        })
    }
}





module.exports = {
    sell,
    merchanSellList,
    getSellInfo
}