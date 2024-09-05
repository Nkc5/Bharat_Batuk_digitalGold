const axios = require('axios')
const { userAugmontModel, tokenAugmontModel } = require('../../models/augmont/user_augmont.js');
const { buyInvoiceModel, redeemInvoiceModel, sellInvoiceModel } = require('../../models/augmont/invoice.js');


const historicalData = async (req, res) => {
    const customerRefNo = req.user._id.toString();

    const { fromDate, toDate, metalType } = req.body;

    const user = await userAugmontModel.findOne({ customerRefNo }).sort({ _id: -1 });
    const token = await tokenAugmontModel.findOne().sort({ _id: -1 });

  

    try {
       
        const response = await axios.get(`${process.env.Augmont_URL}/merchant/v1/rolling-data?fromDate=${fromDate}&toDate=${toDate}&metalType=${metalType}`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token.token_augmont}`
            }
        });

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
        });
    }
}

module.exports = {
    historicalData
}