

const axios = require('axios')
const cron = require('node-cron');
const { tokenAugmontModel, userAugmontModel } = require('../../models/augmont/user_augmont.js');



const login = async (req, res) => {

    console.log("in login api");

    const formData = new FormData();

    try {

        formData.append('email', process.env.Augmont_Username);
        formData.append('password', process.env.Augmont_Password);

        const response = await axios.post('https://uat-api.augmontgold.com/api/merchant/v1/auth/login', formData, {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        })

        const token = await tokenAugmontModel.create({ token_augmont: response.data.result.data.accessToken });
        console.log("token", token);
        const user = await userAugmontModel.updateMany({}, { $set: { token_augmont: response.data.result.data.accessToken } });
        console.log("user", user);

        return res.status(200).json({
            error: true,
            message: 'success',
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




const login_partner = async () => {

    console.log("in login api");

    const formData = new FormData();

    try {

        formData.append('email', process.env.Augmont_Username);
        formData.append('password', process.env.Augmont_Password);

        const response = await axios.post('https://uat-api.augmontgold.com/api/merchant/v1/auth/login', formData, {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        })

        const token = await tokenAugmontModel.create({ token_augmont: response.data.result.data.accessToken });
        console.log("token", token);
        const user = await userAugmontModel.updateMany({}, { $set: { token_augmont: response.data.result.data.accessToken } });
        console.log("user", user);
        return;

    } catch (error) {
        console.log("error", error);
        return;
    }


}



// cron job to login every 25 days
const schedule = '0 0 */25 * *'
cron.schedule(schedule, login_partner)



module.exports = login;