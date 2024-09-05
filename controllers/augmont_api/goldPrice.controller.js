const Rates=require('../../models/augmont/Gold_silver_rates.js')
const userModel = require('../../models/user.models.js');

const Gold=async(req,res)=>{



    try{
        console.log("Hii")
       
       
        const token = await Rates.find({})
        console.log("token",token)


        return res.status(200).json({
            error:false,
            message:"Success",
            data:[token]


        })






    }catch(err){
        return res.status(400).json({
            error:true,
            message:"Something Went Wrong",
            data:[]

        })

    }
}

module.exports={Gold}







