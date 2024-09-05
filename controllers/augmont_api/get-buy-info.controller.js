const axios = require('axios');
const { userAugmontModel, tokenAugmontModel } = require('../../models/augmont/user_augmont.js');
const goldRates = require('../../models/augmont/Gold_silver_rates.js');
const bankModel = require('../../models/bank.models.js');
const {buyModel} = require('../../models/augmont/buy_response.js');
const buyReqModel = require('../../models/augmont/buy_request.js');
const buyRequestModel=require('../../models/augmont/buy_req.js');

const Buy= async (req, res) => {
    console.log("Hii")
    const customerRefNo = req.user._id.toString();
    console.log("customerRefNo",customerRefNo)
    // console.log("uni")

    const { metalType,quantity, merchantTransactionId,amount} = req.body;
    const data=req.body;
    console.log("req.body",req.body)
    // const { metalType, quantity, merchantTransactionId} = req.body;


    const user = await userAugmontModel.findOne({customerRefNo}).sort({ _id: -1 });
    const token = await tokenAugmontModel.findOne({}).sort({ _id: -1 });
    const rates = await goldRates.findOne().sort({ _id: -1 });
    const buy = await buyReqModel.findOne({customerRefNo}).sort({ _id: -1 });
    // const buy1 = await buyRequestModel.findOne({customerRefNo}).sort({ _id: -1 });
    


    // const dbResponse1 = await buyRequestModel.create({customerRefNo, ...data});
    // console.log("dbResponse", dbResponse1)
    // const bank = await bankModel.findOne({customerRefNo}).sort({_id: -1});
    // console.log("first",user)
    // console.log("first",token)
    // console.log("first",rates)
    console.log("buy",buy)








    try {
        const formData = new FormData();

        formData.append('lockPrice', metalType == "gold" ? buy.pricePerGram : buy.pricePerGram);
        formData.append('metalType', metalType);
        // formData.append('quantity', quantity);

        // formData.append('amount', "500");
        formData.append('merchantTransactionId', merchantTransactionId);
        quantity ? formData.append('quantity', quantity) : formData.append('amount', amount)

        // formData.append('userState', user.state);
        formData.append('uniqueId', user.uniqueId);
        formData.append('blockId', buy.blockId);
        // formData.append('modeOfPayment', "NEFT");
        // formData.append('referenceType', "123456abc");
        // formData.append('referenceId', "123456abc");
        // formData.append('utmSource', utmSource);
        // formData.append('utmMedium', utmMedium);
        // formData.append('utmCampaign', utmCampaign);
        console.log("formData",formData)
    
    
        const headers = {
            "Accept": "application/json",
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token.token_augmont}`
        }
        console.log("first",headers)
    
    
    

        const response = await axios.post(`${process.env.Augmont_URL}/merchant/v1/buy`, formData,{
            headers: headers
        });
        // return response.data
        // console.log("response",response.data)
        const dbResponse = await buyModel.create({customerRefNo, ...response.data});
        console.log("dbResponse", dbResponse)
  
        return res.status(200).json({
            error: false,
            message: "success",
            data: [{...response.data,
                type:"buy"
            }]
        })



    }
    catch (error) {
        console.log("error", error.response.data);
        console.log("error", error.response.data.errors);
        
        return res.status(400).json({
            error: true,
            // statusCode:error.response.data.statusCode,
            message: error.response.data.errors,
            data: []
        })

    }

}
const getBuy=async(req,res)=>{
    const customerRefNo = req.user._id.toString();
    console.log("customerRefNo",customerRefNo)
    // const buy = await buyReqModel.findOne({customerRefNo}).sort({ _id: -1 });
    const {buyMerchantTxnId} = req.params;
    console.log("req.params", req.params)
    const user = await userAugmontModel.findOne({ customerRefNo }).sort({ _id: -1 });
    const token = await tokenAugmontModel.findOne({}).sort({ _id: -1 });
   
    
    // const {buy.buyMerchantTxnId} = req.params;
    // console.log("req.params", req.params)
    try{
        const response = await axios.get(`${process.env.Augmont_URL}/merchant/v1/buy/${buyMerchantTxnId}/${user.uniqueId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token.token_augmont}`
            }
        })
        return res.status(200).json({
            error:false,
            message:"Success",
            data:[response.data]
        })
   

    } catch (error) {
        console.log("error", error.response.data);
        console.log("error", error.response.data.errors);
        
        return res.status(400).json({
            error: true,
            // statusCode:error.response.data.statusCode,
            message: error.response.data.errors.quantity[0].message,
            data: []
        })

    }
}



const merchantBuyList = async (req, res) => {

    const customerRefNo = req.user._id.toString();
    const user = await userAugmontModel.findOne({customerRefNo}).sort({ _id: -1 });
    const token = await tokenAugmontModel.findOne({}).sort({ _id: -1 });

    try {

        const response = await axios.get(`${process.env.Augmont_URL}/merchant/v1/${user.uniqueId}/buy`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token.token_augmont}`
            }
        })
        return response.data;
        
        console.log("response",response)

        return res.status(200).json({
            error: false,
            message: 'succes',
            data: [response.data]
        })


    } catch (error) {
        console.log("error", error.response.data);
        
        return res.status(400).json({
            error: true,
            // statusCode:error.response.data.statusCode,
            message: error.response.data.message,
            data: []
        })
    }
}




module.exports = {
    Buy,
    getBuy,
    merchantBuyList
}