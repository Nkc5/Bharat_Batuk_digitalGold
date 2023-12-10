

const userModel = require("../../models/user.models.js");
// const {reqUser} = require('../../middlewares/auth.middleware.js');
const UserController = require('./security.controller.js');


class logout {

  // Logout User
  static async logoutUser(req, res) {

    const user = req.user;
    if (!user) { res.json("please login") }

    // console user
    console.log("req.user", user);

    const customerRefNo = user._id;
    console.log(id);

    // delete token from database with customerRefNo
    const findUser = await userModel.findOne({ "_id": customerRefNo });
    findUser.jwt_token = null;
    findUser.save()

    return res.json({
      error: false,
      message: "Successfully logout",
      data: []

       });

  } catch(err) {
    console.log(err);
    return res.json({
      error: true,
      message: err,
      data: null
    });
  }
}


module.exports = logout;