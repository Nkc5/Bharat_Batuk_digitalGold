const axios = require('axios');
const { userAugmontModel } = require('../../models/augmont/user_augmont.js');
const bankModel = require('../../models/bank.models.js');
const bankAugmont = require('../../models/augmont/bank_augmont.js');

const bankCreate = async (req, res) => {
    var customerRefNo = req.user._id.toString();

    try {
        const user = await userAugmontModel.findOne().sort({ _id: -1 });
        const bankData = await bankModel.findOne({ customerRefNo }).sort({ _id: -1 })
        console.log("bankData", bankData)


        const formData = new FormData();
        formData.append('accountNumber', bankData.msg.account_no)
        formData.append('accountName', bankData.msg.name)
        formData.append('ifscCode', bankData.msg.ifsc)
        console.log('formData', formData);


        const response = await axios.post(`${process.env.Augmont_URL}/merchant/v1/users/${user.uniqueId}/banks`, formData, {
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${user.token_augmont}`,
            }
        });

        console.log("response", response.data);

        const bankDB = await bankAugmont.create({ customerRefNo, ...response.data });
        console.log("bankDB", bankDB);

        return res.status(200).json({
            error: false,
            message: "Success",
            data: [response.data]
        });
    } catch (err) {
        console.error("Error:", err);
        return res.status(400).json({
            error: true,
            message: err.response.data.message,
            data: []
        });
    }
};





const updateBank = async (req, res) => {
    var customerRefNo = req.user._id.toString();

    try {
        const user = await userAugmontModel.findOne().sort({ _id: -1 });
        const bankData = await bankModel.findOne({ $and: [{ customerRefNo }, { type: 'B' }] }).sort({ _id: -1 })
        console.log("bankData", bankData)

        const bankAugmont = await bankAugmont.findOne({customerRefNo}).sort({_id:-1});

        const formData = new FormData();
        formData.append('accountNumber', bankData.msg.account_no)
        formData.append('accountName', bankData.msg.name)
        formData.append('ifscCode', bankData.msg.ifsc)
        console.log('formData', formData);


        const response = await axios.post(`${process.env.Augmont_URL}/merchant/v1/users/${user.uniqueId}/banks/{{user_bank_id}}`, formData, {
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${user.token_augmont}`,
            }
        });

        console.log("response", response.data);

        const bankDB = await bankAugmont.create({ customerRefNo, ...response.data });
        console.log("bankDB", bankDB);

        return res.status(200).json({
            error: false,
            message: "Success",
            data: [response.data]
        });
    } catch (err) {
        console.error("Error:", err);
        return res.status(400).json({
            error: true,
            message: err.response.data.message,
            data: []
        });
    }
};








const bankList = async (req, res) => {
    var customerRefNo = req.user._id.toString();

    try {
        const user = await userAugmontModel.findOne().sort({ _id: -1 });


        const response = await axios.get(`${process.env.Augmont_URL}/merchant/v1/users/${user.uniqueId}/banks`, {
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${user.token_augmont}`,
            }
        });

        return res.status(200).json({
            error: false,
            message: "Success",
            data: [response.data]
        });
    } catch (err) {
        console.error("Error:", err);
        return res.status(400).json({
            error: true,
            message: err.response.data.message,
            data: []
        });
    }
};





module.exports = {
    bankCreate,
    bankList,
};
