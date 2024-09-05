
const axios = require('axios');
const finzyModel = require('../../models.finzee.models.js');



const paymentLink = async (req, res) => {

    const customerRefNo = req.user._id.toString();

    const { amount } = req.body;
    const user = await finzyModel.findOne({ customerRefNo });

    try {


        const response = await axios.post(`https://uatapis.finzy.com/v1/lenders/${user.lenderId}`, { amount }, {
            headers: {
                'partner-code': process.env.PartnerCode,
                'x-api-key': process.env.finzyApikey
            }
        })

        console.log("response", response.data);

        return res.status(200).json({
            error: true,
            message: "success",
            data: [
                response.data
            ]
        })

    } catch (error) {
        console.log("error", error);
        return res.status(400).json({
            error: true,
            message: error
        })
    }


}



module.exports = paymentLink;