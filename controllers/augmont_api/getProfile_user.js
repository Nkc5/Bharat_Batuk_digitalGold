
const axios = require('axios');
const { userAugmontModel, tokenAugmontModel } = require('../../models/augmont/user_augmont.js');




const userProfile = async (req, res) => {

    const customerRefNo = req.user._id.toString();

    const user = await userAugmontModel.findOne({ customerRefNo }).sort({ _id: -1 });
    const token = await tokenAugmontModel.findOne().sort({ _id: -1 });

    console.log("user", user);
    console.log("token", token);


    try {
        const response = await axios.get(`${process.env.Augmont_URL}/merchant/v1/users/${user.uniqueId}`, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token.token_augmont}`
            }
        })

        return res.status(200).json({
            error: true,
            message: 'success',
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


module.exports = userProfile;