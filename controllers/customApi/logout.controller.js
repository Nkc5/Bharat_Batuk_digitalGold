

const userModel = require("../../models/user.models.js");
// const {reqUser} = require('../../middlewares/auth.middleware.js');
const UserController = require('./security.controller.js');


class logout {


  // Logout User
  static async logoutUser(req, res) {

    const user = req.user;
    if (!user) {
      return res.status(400).json({
        error: false,
        message:"Already Logout!, please login",
        data: []

      });
    }

    // console user
    console.log("req.user", user);

    const customerRefNo = user._id;


    // delete token from database with customerRefNo
    const findUser = await userModel.findOne({ _id: customerRefNo });
    findUser.jwt_token = null;
   await findUser.save()

    return res.status(200).json({
      error: false,
      message: "Successfully logout",
      data: []

    });

  } catch(err) {
    console.log(err);
    return res.status(400).json({
      error: true,
      message: err,
      data: []
    });
  }



  

//deletAccount
static async deleteAccount(req, res) {
  try {
    const customerRefNo = req.user._id;

    // Update the 'is_deleted' flag instead of physically deleting the data
    const addressDB = await userModel.findOneAndUpdate({ _id: customerRefNo }, { is_deleted: 1 }, { new: true });

    if (!addressDB) {
      return res.status(404).json({
        error: true,
        message: 'Account not found',
        data: [],
      });
    }

    return res.status(200).json({
      error: false,
      message: 'Account marked as deleted',
      data: [addressDB],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: true,
      message: 'Internal server error',
      data: null,
    });
  }
}






}


module.exports = logout;