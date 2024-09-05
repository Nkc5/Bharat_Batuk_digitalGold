const axios = require("axios");
const { tokenAugmontModel, userAugmontModel } = require('../../models/augmont/user_augmont.js');
const { merchanSellList } = require('./sell_augmont.js')
const { GetOrderList } = require('./Get_Order_List.controller.js');
const buyReqModel = require('../../models/augmont/buy_request.js')

class GetPassbook {


    async passbook(req, res) {


        const token = await tokenAugmontModel.findOne().sort({ _id: -1 })
        const unique = await userAugmontModel.findOne().sort({ _id: -1 })


        const headers = {

            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token.token_augmont}`,
        }

        try {

            const response = await axios.get(`${process.env.Augmont_URL}/merchant/v1/users/${unique.uniqueId}/passbook`, {
                headers: headers
            });

            console.log('response', response)


            console.log("response", response.data)

            return res.status(200).json({
                error: false,
                message: "success",
                data: [
                    response.data,

                ]
            })

        }
        catch (err) {
            return res.status(400).json({
                error: true,
                message: "something went wrong",
                data: []
            })
        }

    }

}



module.exports = { GetPassbook }
