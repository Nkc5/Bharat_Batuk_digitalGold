
const axios = require('axios');
const {userAugmontModel, tokenAugmontModel} = require('../../models/augmont/user_augmont');



const updateUser = async (req, res) => {

    const { userName, userState } = req.body;

    const customerRefNo = req.user._id.toString();
    const user = await userAugmontModel.findOne({customerRefNo});


    try {
        const formData = new FormData();
        formData.append('userName', userName);
        formData.append('userState', userState);

        const response = await axios.put(`${process.env.Augmont_URL}/merchant/v1/users/{{unique_id}}`, formData, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${user.token_augmont}`
            }
        }
        )

        return res.status(200).json({
            error: false,
            message: 'success',
            data: [
                response.data
            ]
        })

    } catch (error) {
        console.log("error", error);
        return res.status(400).json({
            error: true,
            message: error.response.data,
            data: []
        })
    }


}