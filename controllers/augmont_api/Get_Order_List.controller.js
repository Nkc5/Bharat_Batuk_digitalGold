const axios = require('axios');
const { tokenAugmontModel, userAugmontModel } = require('../../models/augmont/user_augmont.js');




 const list= async(req, res)=> {
        const token = await tokenAugmontModel.findOne().sort({ _id: -1 })
        // const unique = await userAugmontModel.findOne().sort({ _id: -1 })
        const customerRefNo = req.user._id.toString();
        const user = await userAugmontModel.findOne({ customerRefNo }).sort({ _id: -1 });

        // console.log('uniqueId', unique);
        // const {count,page,}
        /***const {count,page,fromDate,toDate}=req.params ***/
        const headers = {

            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token.token_augmont}`,
        }
        try {

            const response = await axios.get(`${process.env.Augmont_URL}/merchant/v1/${user.uniqueId}/order`, {
                headers: headers
            });
            console.log(response);
            return response.data;

            console.log("response", response.data)

            return res.status(200).json({
                error: false,
                message: "success",
                data: [response.data]
            })


        }
        catch (err) {
            return res.status(400).json({
                error: true,
                message: err,
                data: []
            })

        }
    }



module.exports = { list }
