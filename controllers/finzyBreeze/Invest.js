const axios=require('axios')
const finzee=require('../../models/finzee.models.js')


const invest=async(req,res)=>{


    const data={
        
            "partnerId" : "SWA508",
            "productInvestments" : [
                {
                    "productCode" : "F12",
                    "productVersion" : 6,
                    "investmentAmount" : 10000
                }
            ]
        
    }
    
    const headers = {
        'Content-Type': 'application/json',
        'x-api-key': process.env.finzyApikey,
        'partner-code': process.env.PartnerCode,

      }
      const user = await finzee.findOne({customerRefNo});
     
    try{
    
        const response=axios.post(`https://apis.finzy.com/v1/lenders/${user.lenderId}/investments`,data,{
            headers:headers

            

        })
        console.log("response",response.data)
        return res.status(200).json({
            error:false,
            message:"Successful",
            data:[response.data]
        })

    }catch(error){
         return res.status(400).json({
            error:true,
            message:error
         })
    }




}
module.exports=invest;