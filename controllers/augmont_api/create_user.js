

const axios = require('axios');
const crypto = require('crypto');
const { userAugmontModel, tokenAugmontModel } = require('../../models/augmont/user_augmont');
const userModel = require('../../models/user.models.js');
const addressModel = require('../../models/address.models.js');



const createUserAccount = async (customerRefNo, name) => {

    const uniqueId = crypto.randomUUID().substring(0, 10);
    const token = await tokenAugmontModel.findOne().sort({ _id: -1 });
    const address = await addressModel.findOne({ $and: [{ customerRefNo }, { type: 'B' }] }).sort({ _id: -1 });

    try {

        const formData = new FormData();

        formData.append('uniqueId', uniqueId);
        formData.append('userName', name);
        formData.append('userPincode', address.zip);

        console.log("formData", formData);

        const response = await axios.post(`${process.env.Augmont_URL}/merchant/v1/users`, formData, {
            headers: {
                'Accept': 'application/json',
                "Content-Type": "multipart/form-data",
                'Authorization': `Bearer ${token.token_augmont}`
            }
        })

        const model = await userAugmontModel.create({
            customerRefNo,
            uniqueId,
            customerMappedId: response.data.result.data.customerMappedId
        })

        const user = await userModel.findOneAndUpdate({_id: customerRefNo}, {uniqueId},{new : true} );

        return response.data;

    } catch (error) {
        return error.response.data

    }

}

module.exports = createUserAccount; 
