const axios = require('axios')
const { tokenAugmontModel, userAugmontModel } = require('../../models/augmont/user_augmont.js');
const Rates = require('../../models/augmont/Gold_silver_rates.js')
const userModel = require('../../models/user.models.js');
const cron = require('node-cron');



const rates = async (req, res) => {
    console.log("req.user", req.user)
    const customerRefNo = req.user._id.toString();
    var user = await userModel.findOne({ _id: customerRefNo });
    console.log("user", user)
    // var customerRefNo = req.user._id.toString();
    const token = await tokenAugmontModel.findOne().sort({ _id: -1 });


    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token.token_augmont}`
    }


    try {
        const response = await axios.get('https://uat-api.augmontgold.com/api/merchant/v1/rates', {
            headers: headers




        })
        //  const apiData = response.data.data.result.data;
        console.log("Hii")
        const model = await Rates.create({
            customerRefNo,
            // apiData
            gBuy: response.data.result.data.rates.gBuy,
            gSell: response.data.result.data.rates.gSell,
            sBuy: response.data.result.data.rates.sBuy,
            sSell: response.data.result.data.rates.sSell,
            gBuyGst: response.data.result.data.rates.gBuyGst,
            sBuyGst: response.data.result.data.rates.sBuyGst,

            taxes: response.data.result.data.taxes,
            blockId: response.data.result.data.blockId,




        })
        console.log("model", model)

        console.log(response.data)
        console.log("response", response.data)

        return res.status(200).json({
            error: false,
            message: "Success",
            data: [response.data]
        })

    } catch (err) {
        return res.status(400).json({
            error: true,
            message: "Something Went Wrong",
            data: []
        })

    }
}





const currentRates = async () => {

    const token = await tokenAugmontModel.findOne().sort({ _id: -1 });


    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token.token_augmont}`
    }


    try {
        const response = await axios.get('https://uat-api.augmontgold.com/api/merchant/v1/rates', {
            headers: headers
        })
        console.log("Hii")
        const model = await Rates.create({
            // apiData
            gBuy: response.data.result.data.rates.gBuy,
            gSell: response.data.result.data.rates.gSell,
            sBuy: response.data.result.data.rates.sBuy,
            sSell: response.data.result.data.rates.sSell,
            gBuyGst: response.data.result.data.rates.gBuyGst,
            sBuyGst: response.data.result.data.rates.sBuyGst,

            taxes: response.data.result.data.taxes,
            blockId: response.data.result.data.blockId,

        })
        console.log("model", model)
        console.log("response", response.data)

        return;

    } catch (err) {
        return console.log("error", err);

    }
}




// cron job to get current rates every 1 minute
const schedule = '* * * * *'
cron.schedule(schedule, currentRates)




const deleteOldData = async () => {
    const threshold = Date.now() - 120000;
    const rates = await Rates.deleteMany({ createdAt: { $lt: threshold } });
    console.log("deleted old data", rates);
};


// Schedule deletion every 2 minutes
cron.schedule('*/2 * * * *', deleteOldData);


module.exports = {
    rates
}