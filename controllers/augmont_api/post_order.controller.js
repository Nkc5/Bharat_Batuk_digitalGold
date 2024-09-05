const axios = require('axios');
const { tokenAugmontModel, userAugmontModel } = require('../../models/augmont/user_augmont.js');
const { buyModel } = require('../../models/augmont/buy_response.js')
const userModel = require('../../models/user.models.js');
const addressModel = require('../../models/augmont/address_augmont.js')
const redeemModel = require('../../models/augmont/redeem_order.js');


// const addressModel = require('../../models/address.models.js')

const crypto = require('crypto');


const postOrder = async (req, res) => {

    const customerRefNo = req.user._id.toString();
    console.log("customerRefNo", customerRefNo)
    const user = await userModel.findOne({ _id: customerRefNo })

    console.log("object", user)

    try {


        const token = await tokenAugmontModel.findOne().sort({ _id: -1 });
        const unique = await userAugmontModel.findOne({ customerRefNo }).sort({ _id: -1 });
        // const buy = await buyModel.findOne({customerRefNo}).sort({ _id: -1 });
        const merchantTransactionId = crypto.randomUUID();
        console.log("merchantTransactionId",merchantTransactionId)

        const address = await addressModel.findOne({customerRefNo})
        console.log("address",address)
        console.log("first",unique.uniqueId)
        
     
        const {product1,quantity1,userAddressId}=req.body;

        const productResponse = await axios.get(`${process.env.Augmont_URL}/merchant/v1/products/${product1}`,
        {
            headers:{
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token.token_augmont}`,
            }
        })


        console.log("Unique Object:", unique);
        const formData = new FormData();

        formData.append('uniqueId', unique.uniqueId);
        formData.append('mobileNumber', user.phone);
        formData.append('merchantTransactionId',merchantTransactionId);
       
        
        formData.append('user[shipping][addressId]', userAddressId);
        formData.append('product[0][sku]', product1);
        formData.append('product[0][quantity]',quantity1);

        console.log("FormDataOrder", formData);

        const headers = {
            "Content-Type": "application/json",
            // "Accept": "application/json",
            "Authorization": `Bearer ${token.token_augmont}`,

        };

        const response = await axios.post(`${process.env.Augmont_URL}/merchant/v1/order`, formData, {
            headers: headers
        });
        
        const dbResponse = await redeemModel.create({ customerRefNo, ...response.data, quantity :quantity1, metalType: productResponse.data.result.data.metalType });
        console.log("dbResponse", dbResponse)



        return res.status(200).json({
            error: false,
            message: "Success",
            data: [response.data]
        });
    }
    catch (error) {
        console.log("error", error.response.data);
        console.log("error", error.response.data.errors);

        return res.status(400).json({
            error: true,
            statusCode: error.response.data.statusCode,
            message: error.response.data.errors,
            data: []
        })

    }

}





const augmontReedem = async (customerRefNo, phone,userAddressId, product1, quantity1) => {

    try {

        const token = await tokenAugmontModel.findOne().sort({ _id: -1 });
        const unique = await userAugmontModel.findOne({ customerRefNo }).sort({ _id: -1 });
        
        const merchantTransactionId = crypto.randomUUID();

        
        const productResponse = await axios.get(`${process.env.Augmont_URL}/merchant/v1/products/${product1}`,
        {
            headers:{
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token.token_augmont}`,
            }
        })


        console.log("Unique Object:", unique);
        const formData = new FormData();

        formData.append('uniqueId', unique.uniqueId);
        formData.append('mobileNumber', phone);
        formData.append('merchantTransactionId',merchantTransactionId);
        formData.append('user[shipping][addressId]', userAddressId);
        formData.append('product[0][sku]', product1);
        formData.append('product[0][quantity]',quantity1);

        console.log("FormDataOrder", formData);

        const headers = {
            "Content-Type": "application/json",
            // "Accept": "application/json",
            "Authorization": `Bearer ${token.token_augmont}`,

        };

        const response = await axios.post(`${process.env.Augmont_URL}/merchant/v1/order`, formData, {
            headers: headers
        });
        const dbResponse = await redeemModel.create({ customerRefNo, ...response.data, quantity :quantity1, metalType: productResponse.data.result.data.metalType });
        console.log("dbResponse", dbResponse)



        return response.data;
    }
    catch (error) {
        console.log("error", error.response.data);
        return  error.response.data.errors

    }

}




module.exports = { postOrder, augmontReedem }