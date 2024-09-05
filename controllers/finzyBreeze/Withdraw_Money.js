const withdraw=require('../../models/finzee.models.js')
const axios=require('axios')


const withdraw=async(req,res)=>{


    const data={
        
            "withdrawRequests": [
              {
                "productCode": "ABC123",
                "withdrawalAmount": 500
              },
              {
                "productCode": "XYZ789",
                "withdrawalAmount": 1000
              }
            ]
          
    }
    const headers = {
        'Content-Type': 'application/json',
        'x-api-key': process.env.finzyApikey,
        'partner-code': process.env.PartnerCode,

      }
      const withdraw=await withdraw.findOne({customerRefNo})






    try{
        const response=axios.post(`https://apis.finzy.com/v1/lenders/${withdraw.lenderId}/withdraw`,data,{
            headers:headers

        })
        console.log("response",response.data)
        return response.status(200).json({
            error:false,
            message:"Success",
            data:[response.data]
        })

    }catch(error){
        return res.status(400).json({
            error:true,
            message:error
         })

    }
}
module.exports=withdraw;