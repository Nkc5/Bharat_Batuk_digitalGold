const axios = require('axios')
const { userAugmontModel, tokenAugmontModel } = require('../../models/augmont/user_augmont.js');
const {withdrawModel}=require('../../models/augmont/withdraw_augmont.js')


const withdraw = async (req, res) => {

    const customerRefNo = req.user._id.toString();

    const user = await userAugmontModel.findOne({ customerRefNo }).sort({ _id: -1 });
    const token = await tokenAugmontModel.findOne().sort({_id:-1});
    const { sell_txn_id } = req.params; //sell_txn_id = sell transaction id
    console.log("req.params", req.params)

    const headers = {
        "Accept": "application/json",
        'Content-Type': "application/json",
        'Authorization': `Bearer ${token.token_augmont}`
    }
  

    try {
        const response = await axios.get(`${process.env.Augmont_URL}/merchant/v1/withdraw/${sell_txn_id}/${user.uniqueId}`, {
            headers: headers

        })
        console.log("response",response)
        // console.log("first",response)
        const DBresponse = await withdrawModel.create({ ...response.data});
        console.log("DBresponse", DBresponse);
        console.log("response", response.data)
        console.log("response.data", response.data)

        return res.status(200).json({
            error: false,
            message: "Success",
            data: [response.data]
        })

    }  catch (error) {
        console.log("error", error);
        console.log("error", error.response.data);
        
        return res.status(400).json({
            error: true,
            statusCode:error.response.data.statusCode,
            message: error.response.data.message,
            data: []
        })
    }
}
module.exports = {
    withdraw
}