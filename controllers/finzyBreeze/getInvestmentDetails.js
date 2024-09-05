
const axios = require('axios');
const finzyModel = require('../../models.finzee.models.js')



const getInvestmentDetails = async (req, res) => {

    const customerRefNo = req.user._id.toString();

    try {

        const user = await finzyModel.findOne({ customerRefNo });


        const response = await axios.get(`https://uatapis.finzy.com/v1/lenders/${user.lenderId}/investments`, null, {
            headers:{
                'partner-code': process.env.PartnerCode,
                'x-api-key': process.env.finzyApikey
            }
        });

        console.log("response", response.data);

        return res.status(200).json({
            error: false,
            message: "success",
            data: [
                response.data
            ]
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



module.exports = getInvestmentDetails;