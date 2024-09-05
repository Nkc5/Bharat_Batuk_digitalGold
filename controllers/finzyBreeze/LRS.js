
const axios = require('axios');
const finzyModel = require('../../models/finzee.models.js');



const LRS = async (req, res) => {

    const customerRefNo = req.user._id.toString();
    try {

        const user = await finzyModel.findOne({ customerRefNo });


        const response = await axios.get(`https://uatapis.finzy.com/v1/lenders/${user.investorId}/irs`, null, {
            headers: {
                'partner-code': process.env.PartnerCode,
                'x-api-key': process.env.finzyApikey
            }
        })

        return res.status(200).json({
            error: false,
            message: "success",
            data: [response.data]
        })

    } catch (error) {
        console.log("error", error);
        return res.status(400).json({
            error: true,
            message: error,
            data: []
        })
    }


}


module.exports = LRS;