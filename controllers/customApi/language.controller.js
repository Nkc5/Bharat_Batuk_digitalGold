const userModel = require('../../models/user.models.js');

class language{


   static Language=async(req,res)=>{
    
    try{
    const customerRefNo=req.user._id.toString()

    const { language } = req.body;


    const user=await userModel.findOneAndUpdate({_id:customerRefNo},{language},{new:true})

    console.log("user",user)


      return res.status(200).json({
        error: false,
        message: "language Updated Successfully",
        data: [user]
      });


  

    }catch(err){

        console.log(err)
        return res.status(400).json({
            error: true,
            message: 'Internal server error',
            data: []
          });

    }

    




   }
   static getLanguage = async (req, res) => {
    try {
        const customerRefNo = req.user._id.toString();
        const language = await userModel.findById(customerRefNo); // Fetch the entire user document

        if (!language) {
            return res.status(404).json({
                error: true,
                message: "User not found",
                data: {}
            });
        }

        console.log("language", language);

        return res.status(200).json({
            error: false,
            message: "Language retrieved successfully",
            data: language // Return the entire user document
        });
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            error: true,
            message: 'Internal server error',
            data: {}
        });
    }
}


}
module.exports = language;



