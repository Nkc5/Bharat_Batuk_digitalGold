
const axios = require('axios');
const { userAugmontModel, tokenAugmontModel} = require('../../models/augmont/user_augmont');
const addressModel = require('../../models/address.models.js')
const addressAugmont = require('../../models/augmont/address_augmont.js');




const userAddressCreate = async (customerRefNo, name, phone) => {

    
    const token = await tokenAugmontModel.findOne().sort({_id:-1});
    const user = await userAugmontModel.findOne({ customerRefNo }).sort({ _id: -1 });
    const address = await addressModel.findOne({ $and: [{ customerRefNo }, { type: 'B' }] }).sort({ _id: -1 });

    try {

        const formData = new FormData();

        formData.append('name', name);
        formData.append('mobileNumber', phone);
        formData.append('pincode', address.zip)
        formData.append('address', address.line2 ? `${address.line1} ${address.line2}` : address.line1)


        const response = await axios.post(`${process.env.Augmont_URL}/merchant/v1/users/${user.uniqueId}/address`, formData, {
            headers: {
                'Content-type': 'multipart/form-data',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token.token_augmont}`
            }
        })


        const addressDB = await addressAugmont.create({customerRefNo, ...response.data});

        address.userAddressId = response.data.result.data.userAddressId;
        address.userAccountId = response.data.result.data.userAccountId;

        await address.save();

        return response.data;

    } catch (error) {
        console.log("error", error);
        return  error.response.data.errors;
    }



}






const addressAugmontCommon = async (customerRefNo, name, phone, zip, line1, line2) => {

    
    const token = await tokenAugmontModel.findOne().sort({_id:-1});
    const user = await userAugmontModel.findOne({ customerRefNo }).sort({ _id: -1 });

    try {

        const formData = new FormData();

        formData.append('name', name);
        formData.append('mobileNumber', phone);
        formData.append('pincode', zip)
        formData.append('address', line2 ? `${line1} ${line2}` : line1)

        console.log("formData", formData);

        const response = await axios.post(`${process.env.Augmont_URL}/merchant/v1/users/${user.uniqueId}/address`, formData, {
            headers: {
                'Content-type': 'multipart/form-data',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token.token_augmont}`
            }
        })


        const addressDB = await addressAugmont.create({customerRefNo, ...response.data});
        return response.data;

    } catch (error) {
        console.log("error", error);
        return  error.response.data.errors;
    }



}







const addressCreate = async (req, res) => {

    const customerRefNo = req.user_id.toString();
    const token = await tokenAugmontModel.findOne().sort({_id:-1});
    const user = await userAugmontModel.findOne({ customerRefNo }).sort({ _id: -1 });
    const address = await addressModel.findOne({ $and: [{ customerRefNo }, { type: 'B' }] }).sort({ _id: -1 });

    try {

        const formData = new FormData();

        formData.append('name', req.user.name);
        formData.append('mobileNumber', req.user.phone);
        formData.append('pincode', address.zip)
        formData.append('address', address.line2 ? `${address.line1} ${address.line2}` : address.line1)


        const response = await axios.post(`${process.env.Augmont_URL}/merchant/v1/users/${user.uniqueId}/address`, formData, {
            headers: {
                'Content-type': 'multipart/form-data',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token.token_augmont}`
            }
        })


        const addressDB = await addressAugmont.create({customerRefNo, ...response.data});

        return res.status(200).json({
            error: false,
            message: 'success',
            data: [response.data]
        });

    } catch (error) {
        console.log("error", error);
        return res.status(400).json({
            error: true,
            message: error.response.data.errors,
            data: []
        });
    }



}



const userAddressList = async (req, res) => {

    const customerRefNo = req.user._id.toString();
    const user = await userAugmontModel.findOne({ customerRefNo }).sort({ _id: -1 });
    const token = await tokenAugmontModel.findOne().sort({_id:-1});

    try {
        const response = await axios.get(`${process.env.Augmont_URL}/merchant/v1/users/${user.uniqueId}/address`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token.token_augmont}`
            }
        })

        return res.status(200).json({
            error: false,
            message: 'success',
            data: [response.data]
        })
    } catch (error) {
        console.log("error", error);
        return res.status(400).json({
            error: true,
            message: error.response.data.errors,
            data: []
        })
    }


}


const userAddressDelete = async (req, res) => {


    const { address_id } = req.params;

    const customerRefNo = req.user._id.toString();
    const user = await userAugmontModel.findOne({ customerRefNo }).sort({ _id: -1 });
    const token = await tokenAugmontModel.findOne().sort({_id:-1});


    try {

        const response = await axios.delete(`${process.env.Augmont_URL}/merchant/v1/users/${user.uniqueId}/address/${address_id}`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token.token_augmont}`
            }
        })

        const addressDB = await addressAugmont.findOneAndUpdate({customerRefNo}, {is_deleted:1}, {new:true});
        console.log("addressDB", addressDB)

        return res.status(200).json({
            error: false,
            message: 'success',
            data: [response.data]
        })


    } catch (error) {
        console.log("error", error);
        return res.status(400).json({
            error: true,
            message: error.response.data.errors,
            data: []
        })
    }

}



module.exports = {
    userAddressCreate,
    userAddressList,
    userAddressDelete,
    addressCreate,
    addressAugmontCommon
}