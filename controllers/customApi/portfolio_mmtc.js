const userModel = require('../../models/user.models');

// const tradeBuyController = require('./tradeBuy.controller.js');
const buyResModel = require('../../models/mmtc_buy_response.models');
const sellResModel = require('../../models/mmtc_sell_response.models');
const redeemResModel = require('../../models/mmtc_redeem.models');
const passbook = require('../augmont_api/portfolio.js')

class Portfolio {

    static async getPort(req, res) {

        const customerRefNo = req.user._id.toString();

        try {


            const buyResDB = await buyResModel.aggregate([
                { $match: { customerRefNo: customerRefNo } },

                {
                    $group: {
                        _id: '$customerRefNo',
                        // _id: {$ifNull: ['$customerRefNo', 'customerRefNo']},
                        buyGoldTotalAmount: {
                            $sum: {
                                $cond: [
                                    { $and: [{ $eq: ['$currencyPair', 'XAU/INR'] }, { $eq: ['$orderId.transactionId', true] }] },
                                    { $toDouble: '$preTaxAmount' },
                                    0
                                ]
                            },

                        },

                        buyGoldToTalCount: {
                            $sum: {
                                $cond: [
                                    {
                                        $and: [{ $eq: ['$currencyPair', 'XAU/INR'] }, { $eq: ['$orderId', true] },]
                                    },
                                    { $toDouble: '$quantity' },
                                    0
                                ]
                            }
                        },

                        buySilverTotalAmount: {
                            $sum: {
                                $cond: [
                                    { $and: [{ $eq: ['$currencyPair', 'XAG/INR'] }, { $eq: ['$orderId', true] }] },
                                    { $toDouble: '$preTaxAmount' },
                                    0
                                ]
                            }
                        },

                        buySilverTotalCount: {
                            $sum: {
                                $cond: [
                                    { $and: [{ $eq: ['$currencyPair', 'XAG/INR'] }, { $eq: ['$orderId', true] }] },
                                    { $toDouble: '$quantity' },
                                    0
                                ]
                            }
                        },

                    }

                }
            ])


            const sellResDB = await sellResModel.aggregate([

                { $match: { customerRefNo: customerRefNo } },

                {
                    $group: {
                        _id: '$customerRefNo',
                        sellGoldTotalCount: {
                            $sum: {
                                $cond: [
                                    {
                                        $and: [
                                            { $eq: ['$currencyPair', 'XAU/INR'] },
                                            { $eq: ['$orderId', true] },
                                        ]
                                    },
                                    { $toDouble: '$quantity' },
                                    0
                                ]
                            }
                        },
                        sellSilverTotalCount: {
                            $sum: {
                                $cond: [
                                    {
                                        $and: [

                                            { $eq: ['$currencyPair', 'XAG/INR'] },
                                            { $eq: ['$orderId', true] },
                                        ]
                                    },
                                    { $toDouble: ['$quantity'] },
                                    0

                                ]
                            }
                        }
                    }
                }

            ])


            const redeemResDB = await redeemResModel.aggregate([
                { $match: { customerRefNo: customerRefNo } },

                {
                    $group: {
                        // _id: '$customerRefNo',
                        _id: { $ifNull: ['$customerRefNo', customerRefNo] },
                        redeemGoldTotalCount: {
                            $sum: {
                                $cond: [
                                    {
                                        $and: [
                                            { $eq: ['$productList[0].currencyPair', 'XAU/INR'] },
                                            { $eq: ['remainingBalances[0]', true] },
                                        ]
                                    },
                                    { $toDouble: '$quantity' },
                                    0
                                ]
                            }
                        },
                        redeemSilverTotalCount: {
                            $sum: {
                                $cond: [
                                    {
                                        $and: [
                                            { $eq: ['$productList[0].currencyPair', 'XAG/INR'] },
                                            { $eq: ['$remainingBalance[1]', true] },
                                        ]
                                    },
                                    { $toDouble: '$quantity' },
                                    0

                                ]
                            }
                        }
                    }
                },

                {
                    $group: {
                        _id: 'default',
                        redeemGoldTotalCount: { $first: '$redeemGoldTotalCount' },
                        redeemSilverTotalCount: { $first: '$redeemSilverTotalCount' }
                    }
                }

            ])

            console.log("buyResDB", buyResDB);
            console.log("sellResDB", sellResDB);
            console.log("redeemResDB", redeemResDB);


            const buyResDBsecondTime = await buyResModel.aggregate([
                { $match: { customerRefNo } },

                {
                    $lookup: {
                        from: 'sellResDB',
                        localField: 'customerRefNo',
                        foreignField: 'customerRefNo',
                        as: 'sellData'
                    }

                },

                {
                    $lookup: {
                        from: 'redeemResDB',
                        localField: 'customerRefNo',
                        foreignField: 'customerRefNo',
                        as: 'redeemData'
                    }
                },

                {
                    $project: {
                        _id: '$customerRefNo',
                        goldCountToBeSubtracted: {
                            $sum: [
                                { $first: ['$sellData.sellGoldTotalCount'] || 0 },
                                { $first: ['$redeemData.redeemGoldTotalCount'] || 0 }
                            ]
                        },
                        silverCountToBeSubtracted: {
                            $sum: [
                                { $first: ['$sellData.sellSilverTotalCount'] || 0 },
                                { $first: ['$redeemData.redeemSilverTotalCount'] || 0 }
                            ]
                        },

                        goldAmount: {
                            $cond: {

                                if: {
                                    $and: [{ $eq: ['type', 'BUY'] }, { $eq: ['$currencyPair', 'gold'] }]
                                },
                                then: {
                                    if: { $gt: ['$goldCountToBeSubtracted', 0] },
                                    then: {
                                        if: { $lt: ['$quantity', '$goldCountToBeSubtracted'] },
                                        then: {
                                            $sum: '$preTaxAmount'
                                            
                                            // $goldCountToBeSubtracted: {
                                            //     $subtract: ['$goldCountToBeSubtracted', '$quantity']
                                            // }
                                        },
                                        else: {
                                                $sum: [
                                                    '$goldAmountToBeSubtracted',
                                                    {
                                                        $multiply: [
                                                            { $divide: ['$preTaxAmount', '$quantity'] },
                                                            '$goldCountToBeSubtracted'
                                                        ]
                                                    }
                                                ]
                                        }
                                    },

                                },

                                else: {
                                    
                                },
                            }
                        }
                    }
                }
            ])



            console.log("buyResDBsecondTime", buyResDBsecondTime);


            return res.status(200).send({
                error: false,
                message: 'success',
                data: [{
                    buyResDB,
                    sellResDB,
                    redeemResDB
                }]
            })


        } catch (error) {
            console.log(error)

            return res.json({
                "error": true,
                "message": error.message,
                "data": []
            })
        }
    }


}




module.exports = Portfolio;