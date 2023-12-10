const userModel = require('../../models/user.models'); 
const userMMtc = require('../mmtcApi/user.controller.js');
// const axios = require('axios');





class userActive{


    static async activeuser(req, res){

        const customerRefNo= req.user._id;
           const phone= req.user.phone;
        
            
        // console.log(req.body);
        const data = {customerRefNo,phone}
        

        try{
            const response = await userMMtc.active(data, res);
            
            
       
        const user = await userModel.findOneAndUpdate({"_id":customerRefNo}, {"account_status": 1})
  

          console.log(user)

            return res.json({
                "error": false,
                "message": "success",
                "data": response
            });

        }
        catch(err){
            return res.json({
            "error": true,
            "message": err,
            "data": null
        })
    }

    }


    static async inactiveuser(req, res) {
        const customerRefNo= req.user._id;
        const phone= req.user.phone;
  
  const data = { customerRefNo, phone };
  
  try {
    const response = await userMMtc.inactive(data, res);
    
    // Update user status to 0 (inactive)
    const user = await userModel.findOneAndUpdate({"_id":customerRefNo}, {"account_status": 0})
   

    return res.json({
      error: false,
      message: "success",
      data: response
    });
  } catch (err) {
    console.error('Error:', err);
    return res.json({
      error: true,
      message: err.message,
      data: null
    });
  }
    }


    
    
    

        
    static async validateUser(req, res){

        const customerRefNo= req.user._id;
           const phone= req.user.phone;
        
           console.log(customerRefNo)
            
        // console.log(req.body);
        const data = {customerRefNo,phone}

        try{
            const response = await userMMtc.validate(data, res);

    const user = await userModel.findOneAndUpdate({"_id":customerRefNo}, {"kyc_status": 1})

            return res.json({
                "error": false,
                "message": "success",
                "data": response
            });

        }
        catch(err){
            return res.json({
            "error": true,
            "message": err,
            "data": []
        })
    }

    }



    static async invalidateUser(req, res){

        const customerRefNo= req.user._id;
        const phone= req.user.phone;
        
            
        // console.log(req.body);
        const data = {customerRefNo,phone}

        try{
            const response = await userMMtc.inValidate(data, res);

    const user = await userModel.findOneAndUpdate({"_id":customerRefNo}, {"kyc_status": 0})


            return res.json({
                "error": false,
                "message": "success",
                "data": response
            });

        }
        catch(err){
            return res.json({
            "error": true,
            "message": err,
            "data": null
        })
    }

    }


    static async gosport(req, res) {
        
        const customerRefNo= req.user._id;

    
        try {
            if (!customerRefNo) {
                throw new Error("customerRefNo is required");
            }
    
            const response = await userMMtc.getPortfolio({ customerRefNo }, res);
    
            return res.json({
                "error": false,
                "message": "success",
                "data": response
            });
        } catch (err) {
            return res.json({
                "error": true,
                "message": err.message || "An error occurred",
                "data": null
            });
        }
    }


    static async isPin(req, res){


     const pinCode=110006
     const data={pinCode}

        

        try{
            const response = await userMMtc.isPinCodeServiceable(data, res);
            
       
        // const user = await userModel.create({
        //     customerRefNo,
        //     phone
  
  
        //   })
        //   console.log(user)

            return res.json({
                "error": false,
                "message": "success",
                "data": response
            });

        }
        catch(err){
            return res.json({
            "error": true,
            "message": err,
            "data": null
        })
    }

    }

    
    async verifyPanNumber(req, res) {
        try {
          console.log('Request received:', req.body);
    
          const { pan } = req.body;
    
          if (!pan || pan.length !== 10 || !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan)) {
            console.log('Invalid PAN number');
            return res.status(400).json({ isValid: false, message: 'Invalid PAN number' });
          }
    
          await userModel.updateOne({ pan });
    
          console.log('Pan Verified');
          res.json('Pan Verified');
        } catch (err) {
          console.error(err);
          res.status(500).json({ error: 'Internal server error' });
        }
      }
       
    

    }







module.exports = userActive;