const axios = require("axios");
const { tokenAugmontModel, userAugmontModel } = require('../../models/augmont/user_augmont.js');
const stateModel = require('../../models/augmont/state_augmont.js')

const statelist = async (req, res) => {

    const token = await tokenAugmontModel.findOne().sort({ _id: -1 });
    console.log("token", token)

    const { page } = req.params;

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token.token_augmont}`
    }

    try {

        const response = await axios.get(`${process.env.Augmont_URL}/merchant/v1/master/states?page=${page}`, {
            headers: headers,

        });

        console.log("response.data", response.data);


        // const DBresponse = await stateModel.insertMany({...response.data.result.data});
        // console.log("DBresponse", DBresponse);

        return res.status(200).json({
            error: false,
            message: 'success',
            data: [response.data]
        })

    } catch (err) {

        console.log("err", err)
        return res.status(400).json({
            error: true,
            message: "Something went wrong",
            data: []
        })
    }

}





module.exports = { statelist }