

const axios = require('axios');
const { userAugmontModel, tokenAugmontModel } = require('../../models/augmont/user_augmont.js');
const panModel = require('../../models/pan.models.js');


const kycUpdate = async (customerRefNo, dob) => {

    const user = await userAugmontModel.findOne({ customerRefNo }).sort({ _id: -1 });
    const token = await tokenAugmontModel.findOne().sort({ _id: -1 });
    const pan = await panModel.findOne({ customerRefNo }).sort({ _id: -1 });

    if(!pan){
        return {message: "pan details required"};
    }


    try {
        // pan no is compulsory : adhar not required;
        const formData = new FormData();
        formData.append('panNumber', pan.msg.PanNumber);
        formData.append('nameAsPerPan', pan.msg.NameOnTheCard);
        formData.append('dateOfBirth', dob.split('-').reverse().join('-'));
        formData.append('status', "approved");


        console.log("formData", formData);

        const response = await axios.post(`${process.env.Augmont_URL}/merchant/v1/users/${user.uniqueId}/kyc`, formData, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token.token_augmont}`
            }
        })

        return response.data;

    } catch (error) {
        console.log("error", error);
        return  error.response.data;
    }


}




const getKycDetails = async (req, res) => {

    const customerRefNo = req.user._id.toString();

    try {

        const user = await userAugmontModel.findOne({ customerRefNo }).sort({ _id: -1 });

        const response = await axios.get(`${process.env.Augmont_URL}/merchant/v1/users/${user.uniqueId}/kyc`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token_augmont}`
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
        return res.status(500).json({
            error: true,
            mesage: error.response.data,
            data: []
        })
    }
}




module.exports = {
    kycUpdate,
    getKycDetails
}