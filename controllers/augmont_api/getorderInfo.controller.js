const axios = require("axios");
const { tokenAugmontModel, userAugmontModel } = require('../../models/augmont/user_augmont.js');
// const unique=require('../../models/augmont/user_augmont')
const merchantId = require('../../models/augmont/redeem_order.js');

class getOrderInfo {


    async orderInfo(req, res) {


        // const token = await tokenAugmontModel.findOne().sort({ _id: -1 })
        // const unique = await userAugmontModel.findOne().sort({ _id: -1 })
        // const merchantTransactionId = await merchantId.findOne().sort({ _id: - 1 })
        // console.log('uniqueId', unique);
        // console.log('merchantId', merchantTransactionId);
        const customerRefNo = req.user._id.toString();
        console.log("customerRefNo",customerRefNo)
        const {merchantTransactionId} = req.params;
        console.log("req.params", req.params)
        const token = await tokenAugmontModel.findOne({}).sort({ _id: -1 });
        const user = await userAugmontModel.findOne({}).sort({ _id: -1 });

        const headers = {

            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token.token_augmont}`,
        }

        try {

            const response = await axios.get(`${process.env.Augmont_URL}/merchant/v1/order/${merchantTransactionId}/${user.uniqueId}`, {
                headers: headers
            });

            console.log('response', response)


            // console.log("response", response.data)

            return res.status(200).json({
                error: false,
                message: "success",
                data: [response.data]
            })

        }
        catch (err) {
            console.log('getinfo', err);

            return res.status(400).json({
                error: true,
                message: err,
                data: []
            })
        }

    }

}



module.exports = { getOrderInfo }
