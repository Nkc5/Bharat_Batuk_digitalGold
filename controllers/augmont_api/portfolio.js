const axios = require("axios");
const { tokenAugmontModel, userAugmontModel } = require('../../models/augmont/user_augmont.js');
const goldRates = require('../../models/augmont/Gold_silver_rates.js')
const { buyModel } = require('../../models/augmont/buy_response.js');
const { sellModel } = require('../../models/augmont/sell_response.js');
const redeemModel = require('../../models/augmont/redeem_order.js');




async function passbook(req, res) {

    const customerRefNo = req.user._id.toString();
    const token = await tokenAugmontModel.findOne().sort({ _id: -1 })
    const unique = await userAugmontModel.findOne().sort({ _id: -1 })


    try {

        var buyReponse = await buyModel.find({ customerRefNo });
        console.log("buyReponse", buyReponse)

        var buyDBresponse = await buyModel.aggregate([
            { $match: { customerRefNo: customerRefNo } },
            {
                $group: {
                    _id: '$customerRefNo',
                    buyGoldTotalAmount: {
                        $sum: {
                            $cond:
                                [
                                    { $eq: ['$result.data.metalType', 'gold'] },
                                    { $toDouble: "$result.data.preTaxAmount" },
                                    0 // default to 0
                                ],
                        }
                    },
                    buyGoldTotalCount:{
                        $sum:{
                            $cond:[
                                {$eq: ['$result.data.metalType', 'gold']},
                                {$toDouble: '$result.data.quantity'},
                                0
                            ]
                        }
                    },

                    buySilverTotalAmount: {
                        $sum: {
                            $cond: [
                                { $eq: ['$result.data.metalType', 'silver'] },
                                { $toDouble: "$result.data.preTaxAmount" },
                                0
                            ]
                        }
                    },
                    buySilverTotalCount:{
                        $sum:{
                            $cond:[
                                {$eq: ['$result.data.metalType', 'silver']},
                                {$toDouble: '$result.data.quantity'},
                                0
                            ]
                        }
                    }
                }
            }
        ])

        console.log("buyDBresponse", buyDBresponse);


        var sellDBresponse = await sellModel.aggregate([
            { $match: { customerRefNo: customerRefNo } },
            {
                $group: {
                    _id: '$customerRefNo',
                    sellGoldTotalCount: {
                        $sum: {
                            $cond: [
                                { $eq: ['$result.data.metalType', 'gold'] },
                                { $toDouble: "$result.data.quantity" },
                                0
                            ]
                        }
                    },
                    sellSilverTotalCount: {
                        $sum: {
                            $cond: [
                                { $eq: ['$result.data.metalType', 'silver'] },
                                { $toDouble: "$result.data.quantity" },
                                0
                            ]
                        }
                    }
                }
            }
        ])

        console.log("sellDBresponse", sellDBresponse);

        var redeemDBresponse = await redeemModel.aggregate([
            { $match: { customerRefNo: customerRefNo } },
            {
                $group: {
                    _id: '$customerRefNo',
                    redeemGoldTotalCount: {
                        $sum: {
                            $cond: [
                                { $eq: ['$metalType', 'gold'] },
                                { $toDouble: "$quantity" },
                                0
                            ]

                        }
                    },
                    redeemSilverTotalCount: {
                        $sum: {
                            $cond: [
                                { $eq: ['$metalType', 'silver'] },
                                { $toDouble: "$quantity" },
                                0
                            ]
                        }
                    }
                }
            }
        ])

        console.log("redeemDBresponse", redeemDBresponse);
        console.log("redeemDBresponse[0].redeemGoldTotalCount", redeemDBresponse[0].redeemGoldTotalCount);



        //gold
        let goldSell =  sellDBresponse[0] ? sellDBresponse[0].sellGoldTotalCount: 0 
        let goldReedemed= redeemDBresponse[0] ? redeemDBresponse[0].redeemGoldTotalCount : 0;
        var remainingGoldCount = buyDBresponse[0] ? buyDBresponse[0].buyGoldTotalCount - (goldSell + goldReedemed) : 0;
        
        //silver
        let silverSell = sellDBresponse[0] ? sellDBresponse[0].sellSilverTotalCount : 0 
        let silverReedemed = redeemDBresponse[0] ?  redeemDBresponse[0].redeemSilverTotalCount : 0;
        var remainingSilverCount = buyDBresponse[0] ? buyDBresponse[0].buySilverTotalCount - (silverSell + silverReedemed) : 0;

        console.log("remainingGoldCount", remainingGoldCount);
        console.log("remainingSilverCount", remainingSilverCount);

        var sellGoldTotalAmount = 0;     var sellSilverTotalAmount = 0;
        var remainingSellGold = goldSell + goldReedemed;
        var remainingSellSilver= silverSell + silverReedemed;

        buyReponse.forEach((obj) => {
            if (obj.result.data.metalType === "gold") {

                if (remainingSellGold > 0) {
                    if (obj.result.data.quantity <= remainingSellGold) {
                        sellGoldTotalAmount += Number(obj.result.data.preTaxAmount);
                        remainingSellGold -= Number(obj.result.data.quantity);
                    }
                    else {
                        sellGoldTotalAmount += Number(obj.result.data.rate) * remainingSellGold;
                        remainingSellGold = 0;
                    }
                }
            }
            else {
                if (remainingSellSilver > 0) {
                    if (obj.result.data.quantity <= remainingSellSilver) {
                        sellSilverTotalAmount += Number(obj.result.data.preTaxAmount);
                        remainingSellSilver -= Number(obj.result.data.quantity);
                    }
                    else {
                        sellSilverTotalAmount += Number(obj.result.data.rate) * remainingSellSilver;
                        remainingSellSilver = 0;
                    }
                }
            }
        })

    console.log("sellGoldTotalAmount", sellGoldTotalAmount);
    console.log("sellSilverTotalAmount", sellSilverTotalAmount);

    } catch (error) {
        console.log("error", error);
        return error.message
    }

    try {

        const response = await axios.get(`${process.env.Augmont_URL}/merchant/v1/users/${unique.uniqueId}/passbook`, {
            headers:  {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token.token_augmont}`,
            }
        });


        console.log("response", response.data)


        const rates = await goldRates.findOne({}).sort({ _id: -1 });

        console.log("buyDBresponse[0].buyGoldTotalAmount", buyDBresponse[0].buyGoldTotalAmount);
        console.log("buyGoldTotalCount", buyDBresponse[0].buyGoldTotalCount - sellDBresponse[0].sellGoldTotalCount);
        console.log("buyGoldTotalCount rates", response.data.result.data.goldGrms);
        console.log("buySilverTotalCount", buyDBresponse[0].buySilverTotalCount);
        console.log("buySilverTotalCount rates", response.data.result.data.silverGrms);
        console.log("sellGoldTotalAmount", sellGoldTotalAmount);

        var investedGoldAmount = buyDBresponse[0]? buyDBresponse[0].buyGoldTotalAmount - sellGoldTotalAmount : 0;
        // var currentGoldAmount = Number(response.data.result.data.goldGrms) * Number(rates.gSell);
        var currentGoldAmount = Number(remainingGoldCount) * Number(rates.gSell);
        var differenceIngold = currentGoldAmount - investedGoldAmount;
        var investedSilverAmount = buyDBresponse[0] ? buyDBresponse[0].buySilverTotalAmount - sellSilverTotalAmount : 0;
        // var currentSilverAmount = Number(response.data.result.data.silverGrms) * Number(rates.sSell);
        var currentSilverAmount = Number(remainingSilverCount) * Number(rates.sSell);
        var differenceInSilver = currentSilverAmount - investedSilverAmount;


        console.log("investedGoldAmount", investedGoldAmount);
        console.log("currentGoldAmount", currentGoldAmount);
        console.log("differenceIngold", differenceIngold);
        console.log("investedSilverAmount", investedSilverAmount);
        console.log("currentSilverAmount", currentSilverAmount);
        console.log("differenceInSilver", differenceInSilver);
        
        var percentGold=  differenceIngold < 0 && investedGoldAmount !==0 ? (differenceIngold.toString().replace(/-/g, "")/investedGoldAmount) * 100 : differenceIngold >=0 && investedGoldAmount !==0 ? (differenceIngold/ investedGoldAmount) *100 : 0

        var percentSilver = differenceInSilver < 0 && investedSilverAmount !==0 ? (differenceInSilver.toString().replace(/-/g, "")/investedSilverAmount) * 100 : differenceInSilver >=0 && investedSilverAmount !==0 ? (differenceInSilver/investedSilverAmount) *100 : 0

        console.log("percent gold", percentGold);
        console.log("percent silver", percentSilver);
        console.log(" typeof percent silver", typeof percentSilver);


        return {
            gold: {
                investedAmount: investedGoldAmount.toFixed(2),
                currentAmount:currentGoldAmount.toFixed(2),
                profitORloss: differenceIngold.toFixed(2),
                percent:Number(percentGold).toFixed(2),
                balQuantity: Number(remainingGoldCount).toFixed(2)
             },
            silver: {
                investedAmount: investedSilverAmount.toFixed(2),
                currentAmount:currentSilverAmount.toFixed(2),
                profitORloss: differenceInSilver.toFixed(2),
                percent:Number(percentSilver).toFixed(2),
                balQuantity: Number(remainingSilverCount).toFixed(2)
            }

        }
    }
    catch (error) {

        console.log("error", error)
        return error;
    }

}












const merchanSellList = async (customerRefNo) => {
    const user = await userAugmontModel.findOne({ customerRefNo }).sort({ _id: -1 });
    const token = await tokenAugmontModel.findOne({}).sort({ _id: -1 });


    try {

        const response = await axios.get(`${process.env.Augmont_URL}/merchant/v1/${user.uniqueId}/sell`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token.token_augmont}`
            }
        })

        return response.data;


    } catch (error) {
        return error.response.data.message
    }
}





async function OrderList(customerRefNo) {
    const token = await tokenAugmontModel.findOne().sort({ _id: -1 })
    const user = await userAugmontModel.findOne({ customerRefNo }).sort({ _id: -1 });

    const headers = {

        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token.token_augmont}`,
    }
    try {

        const response = await axios.get(`${process.env.Augmont_URL}/merchant/v1/${user.uniqueId}/order`, {
            headers: headers
        });

        console.log("response", response.data)

        return response.data;
    }
    catch (err) {
        return err.response.data;
    }
}





// async function passbook(req, res) {

//     const customerRefNo = req.user._id.toString();
//     const token = await tokenAugmontModel.findOne().sort({ _id: -1 })
//     const unique = await userAugmontModel.findOne().sort({ _id: -1 })

//     const { result: { data } } = await merchanSellList(customerRefNo);
//     const { result } = await OrderList(customerRefNo);

//     console.log("merchanSellList", data);
//     console.log("OrderList", result);

//     result.data.map((obj) => {
//         var buyGoldTotalAmount = 0; var buySilverTotalAmount = 0;
//         var buyGoldTotalCount = 0; var buySilverTotalCount = 0;

//         if (obj.type == "gold") {
//             buyGoldTotalAmount += Number(obj.amount);
//             buyGoldTotalCount += Number(obj.qty);
//         }
//         else {
//             buySilverTotalAmount += Number(obj.amount);
//             buySilverTotalCount += Number(obj.qty);
//         }

//     })

//     var sellGoldTotalCount = 0;
//     var sellSilverTotalCount = 0;
//     data.map((obj) => {
//         obj.type == "gold" ? sellGoldTotalCount += Number(obj.qty) : sellSilverTotalCount += Number(obj.qty)
//     })

//     let remainingSellGold = sellGoldTotalCount;
//     let remainingSellSilver = sellSilverTotalCount;
//     let sellGoldTotalAmount = 0;
//     let sellSilverTotalAmount = 0;

//     result.data.forEach((obj) => {
//         if (obj.type === "gold") {

//             if (remainingSellGold > 0) {
//                 if (obj.qty <= remainingSellGold) {
//                     sellGoldTotalAmount += Number(obj.amount);
//                     remainingSellGold -= Number(obj.qty);
//                 }
//                 else {
//                     sellGoldTotalAmount += Number(obj.rate) * remainingSellGold;
//                     remainingSellGold = 0;
//                 }
//             }
//         }
//         else {
//             if (remainingSellSilver > 0) {
//                 if (obj.qty <= remainingSellSilver) {
//                     sellSilverTotalAmount += Number(obj.amount);
//                     remainingSellSilver -= Number(obj.qty);
//                 }
//                 else {
//                     sellSilverTotalAmount += Number(obj.rate) * remainingSellSilver;
//                     remainingSellSilver = 0;
//                 }
//             }

//         }
//     })





//     const headers = {

//         'Content-Type': 'application/json',
//         'Accept': 'application/json',
//         'Authorization': `Bearer ${token.token_augmont}`,
//     }

//     try {

//         const response = await axios.get(`${process.env.Augmont_URL}/merchant/v1/users/${unique.uniqueId}/passbook`, {
//             headers: headers
//         });

//         console.log('response', response)


//         console.log("response", response.data)


//         const rates = await ratesModel.findOne({}).sort({ _id: -1 });
//         var investedGoldAmount = buyGoldTotalAmount - sellGoldTotalAmount;
//         var currentGoldAmount = Number(response.data.result.data.goldGrms) * Number(rates.gSell);
//         var investedSilverAmount = buySilverTotalAmount - sellSilverTotalAmount;
//         var currentSilverAmount = Number(response.data.result.data.silverGrms) * Number(rates.gSell);



//         return res.status(200).json({
//             error: false,
//             message: "success",
//             data: [{
//                 gold: {
//                     "goldGrms": response.data.result.goldGrms,
//                     investedGoldAmount: investedGoldAmount.toString(),
//                     currentGoldAmount: currentGoldAmount.toString(),
//                     profiOrloss: String(currentGoldAmount - investedGoldAmount)
//                 },
//                 silver: {
//                     "silverGrms": response.data.result.silverGrms,
//                     investedSilverAmount: investedSilverAmount.toString(),
//                     currentSilverAmount: currentSilverAmount.toString(),
//                     profiOrloss: String(currentSilverAmount - investedSilverAmount)
//                 }

//             }]
//         })

//     }
//     catch (err) {
//         return res.status(400).json({
//             error: true,
//             message: "something went wrong",
//             data: []
//         })
//     }

// }




module.exports = passbook;
