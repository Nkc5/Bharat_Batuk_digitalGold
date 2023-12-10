const userModel = require('../../models/user.models.js');


// static transferId;static dstCustomerRefNo;static dstMobileNumber;static email;static name;static srcCustomerRefNo;static isKycRequired;static channel;static orderId;static clientOrderID;static customerRefNo ;static endDate;static startDate;static billingAddressId;static transactionId;static currencyPair;static value;static type;static calculationType;static transactionOrderID;static transactionDate;static totalAmount;static quantity;static quoteValidityTime;static taxType;static tax1Amt;static tax2Amt;static tax3Amt;static tax1Perc;static tax2Perc;static preTaxAmount;static taxAmount;static quoteId;static createdAt;static userProfile;

class UpdateProfileController {

  static async updateProfile(req, res) {
    try {
      const customerRefNo = req.user._id;
      const updatedUserData = req.body;
      // console.log(userId)

      const mmtcCustRef = req.user.mmtc_customer_ref;

      if (mmtcCustRef) {
        const response = await userMMtc.updateProfile(updatedUserData, res)

        const updatedUser = await userModel.findOneAndUpdate({ "_id": customerRefNo }, updatedUserData, { new: true });
        return res.json({
          error: false,
          message: "Profile Updated Successfully",
          data: [updatedUser]
        });
      }

      else {
        const updatedUser = await userModel.findOneAndUpdate({ "_id": customerRefNo }, updatedUserData, { new: true });
        return res.json({
          error: false,
          message: "Profile Updated Successfully",
          data: [updatedUser]
        });
        
      }

    } catch (err) {
      console.error('Error:', err);
      return res.json({
        error: true,
        message: err.message,
        data: null
      });
    }
  }
}


module.exports = UpdateProfileController;
