const axios=require('axios')
const {tokenAugmontModel, userAugmontModel} = require('../../models/augmont/user_augmont.js');

class productController{


 async Products(req,res){
    const token = await tokenAugmontModel.findOne().sort({_id:-1});
    console.log("token",token)
    
    const {page,count}=req.query;


   const headers={
    'Content-Type':'application/json',
    'Authorization': `Bearer ${token.token_augmont}`
   }


    try{
        const response= await axios.get(`${process.env.Augmont_URL}/merchant/v1/products?page=${page}&count=${count}`,{
         
        
            headers:headers
        })
         

        console.log('response',response)
     

        console.log("response",response.data)


        return res.status(200).json({
            error:false,
            message:"Success",
            data:[response.data]
        })

    }catch(err)
    {
        return res.status(400).json({
            error:true,
            message:"Something Went Wrong",
            data:[]
        })

    }


}


           async showProduct(req,res){

            const token = await tokenAugmontModel.findOne().sort({_id:-1});
            console.log("token",token)

            //   const 
            const {sku}=req.params;


            const headers={
                'Content-Type':'application/json',
                'Authorization': `Bearer ${token.token_augmont}`
               }


               try{
                let response=await axios.get(`${process.env.Augmont_URL}/merchant/v1/products/${sku}`,{

                headers:headers,


                })
                console.log("response",response.data)
                return res.status(200).json({
                    error:false,
                    message:"Success",
                    data:[response.data]


                    
                })
               }catch(error){
                return res.status(400).json({
                    error:true,
                    message:"Something Went Wrong",
                    data:[]
                })

               }

           }
}


module.exports={
    productController

}
