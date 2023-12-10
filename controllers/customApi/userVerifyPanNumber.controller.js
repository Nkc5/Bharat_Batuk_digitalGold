const userModel = require('../../models/user.models.js');

class PanVerificationController {

   static async verifyPanNumber(req, res) {

    try {
      console.log('Request received:', req.body);

      const { pan } = req.body;

      if (!pan || pan.length !== 10 || !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan)) {
        console.log('Invalid PAN number');
        return res.status(400).json({ isValid: false, message: 'Invalid PAN number' });
      }

      
      const customerRefNo = req.user._id;
      
   const user=   await userModel.findOneAndUpdate({"_id": customerRefNo}, {"pan_number": pan})

      console.log("user", user)

      console.log('Pan Verified');
      res.json('Pan Verified');
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }

  }

}

module.exports = PanVerificationController;
