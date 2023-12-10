
const userModel = require('../../models/user.models.js');


class FCM{

    static async updateFCM(req, res){

        try{
            const customerRefNo = req.user._id;

            console.log("customerRefNo", customerRefNo)

            const {fcmToken} = req.body;

            console.log("fcmToken", fcmToken);
            
            if(!fcmToken){
                return res.json({
                    error: true,
                    message: "No FCM Token Found",
                    data: null
                })
            }
        
            const user = await userModel.findOneAndUpdate({"_id": customerRefNo},{"fcm_token": fcmToken}, { new: true })
            
            console.log(user);

            return res.json({
                error: false,
                message: "FCM Token Successfully Stored",
                data: [user]
            })
        }

        catch(err){
            console.log("err:", err);
            return res.json({
                error: true,
                message: err,
                data: null
            })

        }
    }

}


module.exports = FCM;