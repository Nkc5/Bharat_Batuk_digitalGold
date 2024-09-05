const userModel = require('../../models/user.models');
const userMMtc = require('../mmtcApi/user.controller.js');
const tradeMmtc = require('../mmtcApi/trade.controller.js');



// const tradeBuyController = require('./tradeBuy.controller.js');
const buyResModel = require('../../models/mmtc_buy_response.models');
const sellResModel = require('../../models/mmtc_sell_response.models');
const transferModel = require('../../models/transfer.models.js')
const initiateConfirmTransferModel = require('../../models/initiateConfirmTransfer.models.js')
const passbook = require('../augmont_api/portfolio.js')


// const { IsInvestorExist } = require('./p2p.controller.js')

class userActive {


    static async activeuser(req, res) {

        const customerRefNo = req.user._id;
        const phone = req.user.phone;


        const data = { customerRefNo, phone }


        try {
            const response = await userMMtc.active(data, res);



            const user = await userModel.findOneAndUpdate({ "_id": customerRefNo }, { "account_status": 1 })


            console.log(user)

            return res.json({
                "error": false,
                "message": "success",
                "data": response
            });

        }
        catch (err) {
            return res.json({
                "error": true,
                "message": err,
                "data": null
            })
        }

    }


    static async inactiveuser(req, res) {
        const customerRefNo = req.user._id;
        const phone = req.user.phone;

        const data = { customerRefNo, phone };

        try {
            const response = await userMMtc.inactive(data, res);

            // Update user status to 0 (inactive)
            const user = await userModel.findOneAndUpdate({ "_id": customerRefNo }, { "account_status": 0 })


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







    static async validateUser(req, res) {

        const customerRefNo = req.user._id.toString();
        const phone = req.user.phone;

        console.log(customerRefNo)

        // console.log(req.body);
        const data = { customerRefNo, phone }

        try {


            const response = await userMMtc.validate(data, res);

            const user = await userModel.findOneAndUpdate({ "_id": customerRefNo }, { "kyc_status": 1 }, { new: true });

            console.log(user);

            return res.json({
                "error": false,
                "message": "success",
                "data": response
            });

        }
        catch (error) {
            console.log(error)
            const errorMessage = JSON.parse(error.message);
            const errorReason = errorMessage.reason;
            const errorCode = errorMessage.code;

            return res.json({
                "error": true,
                "message": errorReason,
                "data": null,
                "code": errorCode
            })
        }

    }



    static async invalidateUser(req, res) {

        const customerRefNo = req.user._id.toString();
        const phone = req.user.phone;

        const data = { customerRefNo, phone }

        try {
            const response = await userMMtc.inValidate(data, res);

            const user = await userModel.findOneAndUpdate({ "_id": customerRefNo }, { "kyc_status": 0 }, { new: true });
            console.log(user);


            return res.json({
                "error": false,
                "message": "success",
                "data": response
            });

        }
        catch (error) {
            console.log(error)

            const errorMessage = JSON.parse(error.message);
            const errorReason = errorMessage.reason;
            const errorCode = errorMessage.code;

            return res.json({
                "error": true,
                "message": errorReason,
                "data": null,
                "code": errorCode
            })
        }

    }


    static async gosport(req, res) {

        const customerRefNo = req.user._id.toString();

        const user = await userModel.findOne({ _id: customerRefNo })

        const mmtcCustRef = user.mmtc_customer_ref;

        try {
            if (!customerRefNo) {
                throw new Error("customerRefNo is required");
            }
            // const p2p = await IsInvestorExist(req, res)
            // console.log("first", p2p)

            // if (p2p && p2p.data && p2p.data.current_investments.length != 0) {
            //     var current_investments = p2p.data.current_investments;
            //     var past_investments = p2p.data.past_investments;
            // }
            // else {
            //     var current_investments = [];
            //     var past_investments = [];
            // }

            if (mmtcCustRef) {



                //call mmtc getPortfolio to get quantity

                // const p2p1= await p2p.IsInvestorExist({customerRefNo},res)
                // console.log(p2p1)
                const getPort = await userMMtc.getPortfolio({ customerRefNo }, res);
                const totalBuyGrams = Number(getPort.balances[0].balQuantity);
                const totalBuySilverGrams = Number(getPort.balances[1].balQuantity);

                //call mmtc getNonExecutableQuote to get gold current price
                const getNonExecutable = await tradeMmtc.getNonExecutableQuote({ currencyPair: "XAU/INR", type: "SELL" }, res);
                const currentPrice = Number(getNonExecutable.totalAmount);

                console.log("gold current price", currentPrice)

                //silver
                const getNonExecutableSilver = await tradeMmtc.getNonExecutableQuote({ currencyPair: "XAG/INR", type: "SELL" }, res);
                const currentPriceSilver = Number(getNonExecutableSilver.totalAmount);

                console.log("silver current price", currentPriceSilver)


                const currentDate = new Date();
                const endDate = currentDate.toISOString();
                const startDate = "2022-12-13T12:57:51.521Z";

                //call mmtc getOrderHistory to get buy & sell amount
                const getOrderHistory = await tradeMmtc.getOrderHistory({ customerRefNo, endDate, startDate }, res);

                // console.log("getOrderHistory", getOrderHistory)
                let totalBuyAmount = 0; let totalSellAmount = 0;
                let totalBuyAmountSilver = 0; let totalSellAmountSilver = 0;
                let totalRedeemAmount = 0; let totalRedeemAmountSilver = 0;
                let totalTransferAmount = 0; let totalTransferAmountSilver = 0;
                let totalSell = 0; let totalBuy = 0;


                let count = 0; let count2 = 0
                var totalGoldBuy = 0; var totalGoldSell = 0;
                var totalSilverBuy = 0; var totalSilverSell = 0
                var totalGoldRedeem = 0; var totalSilverRedeem = 0;
                var totalTransferGold = 0; var totalTransferSilver = 0;
                var goldCountSell = 0; var silverCountSell = 0;

                if (getOrderHistory.length > 0) {
                    getOrderHistory.map((obj) => {
                        if (obj.type.includes("Buy") || obj.type.includes("BUY")) {

                            if (obj.productSku == "XAU_DMM" && obj.status == "confirmed") {
                                totalBuyAmount += Number(obj.preTaxAmount)
                                console.log("totalBuyGold", totalBuyAmount);
                                count += 1;
                                totalGoldBuy += Number(obj.quantity);
                                console.log("buy count", count)

                            }
                            else if (obj.productSku == "XAG_DMM" && obj.status == "confirmed") {
                                totalBuyAmountSilver += Number(obj.preTaxAmount);
                                console.log("totalBuySilver", totalBuyAmountSilver);
                                totalSilverBuy += Number(obj.quantity);
                            }

                        }

                        else if (obj.type.includes("SELL") || obj.type.includes("Sell")) {

                            if (obj.productSku == "XAU_DMM" && obj.status == "confirmed") {
                                totalSellAmount += Number(obj.totalAmount);
                                console.log("totalSellGold", totalSellAmount)
                                totalGoldSell += Number(obj.quantity);

                                goldCountSell += 1;
                            }
                            else if (obj.productSku == "XAG_DMM" && obj.status == "confirmed") {
                                totalSellAmountSilver += Number(obj.totalAmount);
                                console.log("totalSellAmountSilver", totalSellAmountSilver)
                                totalSilverSell += Number(obj.quantity);
                                silverCountSell += 1;

                            }

                        }

                        else if (obj.type.includes("REDEEM") || obj.type.includes("redeem")) {
                            if (obj.productSku == "XAU_DMM") {
                                totalRedeemAmount += Number(obj.preTaxAmount);
                                console.log("totalRedeemAmountGold", totalRedeemAmount)
                                totalGoldRedeem += Number(obj.quantity);

                            }
                            else if (obj.productSku == "XAG_DMM") {
                                totalRedeemAmountSilver += Number(obj.preTaxAmount);
                                console.log("totalRedeemAmountSilver", totalRedeemAmountSilver)
                                totalSilverRedeem += Number(obj.quantity);
                            }

                        }

                        // else if (obj.type.includes("TRANSFER") || obj.type.includes("transfer")) {
                        //     if (obj.productSku == "XAU_DMM") {
                        //         totalTransferAmount += Number(obj.totalAmount);
                        //         console.log("totalTransferAmount", totalTransferAmount)
                        //         totalTransferGold += Number(obj.quantity);

                        //     }
                        //     else if (obj.productSku == "XAG_DMM") {
                        //         totalTransferAmountSilver += Number(obj.totalAmount);
                        //         console.log("totalTransferAmountSilver", totalTransferAmountSilver)
                        //         totalTransferSilver += Number(obj.quantity);

                        //     }

                        // }
                    })
                }

                console.log("totalBuyAmount:", totalBuyAmount, "count:", count)
                console.log("totalSellAmount", totalSellAmount, "count:", count2)


                var sellGoldTotalAmount = 0; var sellSilverTotalAmount = 0;
                let remainingSellGold = totalGoldSell;
                let remainingSellSilver = totalGoldSell;


                getOrderHistory.forEach((obj, index) => {
                    if (obj.type.includes("Buy") || obj.type.includes("BUY")) {

                        if (obj.productSku == "XAU_DMM" && obj.status == "confirmed") {
                            if (remainingSellGold > 0) {
                                if (obj.quantity <= remainingSellGold) {
                                    sellGoldTotalAmount += Number(obj.preTaxAmount);
                                    remainingSellGold -= Number(obj.quantity);
                                }
                                else {
                                    var rate = Number(obj.preTaxAmount)/Number(obj.quantity);
                                    sellGoldTotalAmount += rate * remainingSellGold;
                                    remainingSellGold = 0;
                                }
                            }
                        }
                        else if (obj.productSku == "XAG_DMM" && obj.status == "confirmed") {

                            if (remainingSellSilver > 0) {
                                if (obj.quantity <= remainingSellSilver) {
                                    sellSilverTotalAmount += Number(obj.preTaxAmount);
                                    remainingSellSilver -= Number(obj.quantity);
                                }
                                else {
                                    var rate = Number(obj.preTaxAmount)/Number(obj.quantity);
                                    sellSilverTotalAmount += rate * remainingSellSilver;
                                    remainingSellSilver = 0;
                                }
                            }
             
                        }

                    }
                })

                /*

 var totalGoldBuy=0; var totalGoldSell=0; 
                var totalSilverBuy = 0;    var totalSilverSell = 0
                var totalGoldRedeem = 0;    var totalSilverRedeem = 0;
                var totalTransferGold = 0;   var totalTransferSilver = 0;
                */

                const totalGold = totalGoldBuy + totalGoldSell + totalGoldRedeem + totalTransferGold;
                const totalSilver = totalSilverBuy + totalSilverSell + totalSilverRedeem + totalTransferSilver;

                console.log("totalGold", totalGold);
                console.log("totalBuyGrams", totalBuyGrams);
                console.log("totalSilver", totalSilver);
                console.log("totalBuySilverGrams", totalBuySilverGrams);
                console.log("totalGoldBuy", totalGoldBuy);
                console.log("totalGoldSell", totalGoldSell);
                console.log("totalSilverBuy", totalSilverBuy);
                console.log("totalSilverSell", totalSilverSell);
                console.log("totalGoldRedeem", totalGoldRedeem);
                console.log("totalTransferGold", totalTransferGold);
                console.log("totalSilverRedeem", totalSilverRedeem);
                console.log("totalTransferSilver", totalTransferSilver);

                // for gold
                // let investedAmount, profitORloss, currentAmount, percent, percentNew
                let investedAmount, profitORloss, currentAmount, percent, percentNew
                if (totalBuyGrams > 0) {
                    investedAmount = (totalBuyAmount - sellGoldTotalAmount - totalRedeemAmount - totalTransferAmount).toFixed(2);
                    currentAmount = (totalBuyGrams * currentPrice).toFixed(2);
                    var currentAmount2 = (totalGold * currentPrice).toFixed(2);
                    profitORloss = (currentAmount - investedAmount).toFixed(2);
                    var profitORloss2 = (currentAmount2 - investedAmount).toFixed(2);
                    percent = ((profitORloss / investedAmount) * 100).toFixed(2);
                    var percent2 = ((profitORloss2 / investedAmount) * 100).toFixed(2);

                }
                else {
                    investedAmount = "0"
                    currentAmount = "0";
                    profitORloss = "0";
                    percent = "0";
                    percentNew = "0";
                }


                const gold2 = { investedAmount, currentAmount2, profitORloss2, percent2 }
                console.log("gold2", gold2)

                let investedAmountSilver, profitORlossSilver, currentAmountSilver, percentSilver, percentNewSilver

                //for silver
                if (totalBuySilverGrams > 0) {
                    investedAmountSilver = (totalBuyAmountSilver - sellSilverTotalAmount - totalRedeemAmountSilver - totalTransferAmountSilver).toFixed(2);
                    currentAmountSilver = (totalBuySilverGrams * currentPriceSilver).toFixed(2);
                    var currentAmountSilver2 = (totalSilver * currentPriceSilver).toFixed(2);
                    profitORlossSilver = (currentAmountSilver - investedAmountSilver).toFixed(2);
                    var profitORlossSilver2 = (currentAmountSilver2 - investedAmountSilver).toFixed(2);
                    percentSilver = ((profitORlossSilver / investedAmountSilver) * 100).toFixed(2);
                    var percentSilver2 = ((profitORlossSilver2 / investedAmountSilver) * 100).toFixed(2);

                }

                else {
                    investedAmountSilver = "0"
                    currentAmountSilver = "0";
                    profitORlossSilver = "0";
                    percentSilver = "0";
                }


                const silver2 = { investedAmountSilver, currentAmountSilver2, profitORlossSilver2, percentSilver2 }

                console.log("silver2", silver2);


                console.log("investedAmount, currentAmount, profitORloss, percent", investedAmount, currentAmount, profitORloss, percent)

                // for gold
                if (percent < 0) {
                    percentNew = percent.replace('-', '')
                }
                else {
                    percentNew = percent;
                }

                //for silver
                if (percentSilver < 0) {
                    percentNewSilver = percentSilver.replace('-', '')
                }
                else {
                    percentNewSilver = percentSilver;
                }


                if (getPort && !getPort.customerName) {
                    getPort.customerName = "empty";
                    getPort.kycStatus = 'I';
                }

                console.log("port", getPort)



                return res.json({
                    "error": false,
                    "message": "success",
                    "data": [{
                        ...getPort,

                        gold: {
                            investedAmount,
                            currentAmount,
                            profitORloss,
                            percentNew
                        }
                        , silver: { investedAmountSilver, currentAmountSilver, profitORlossSilver, percentSilver: percentNewSilver },

                        augmont: await passbook(req, res)

                        // "p2p": {
                        //     "current_investments": current_investments,
                        //     "past_investments": past_investments

                        // }
                    }]
                });
            }

            else {
                return res.json({
                    "error": false,
                    "message": "0 Balance",
                    "data": [
                        {
                            "balances": [
                                {
                                    "balQuantity": null,
                                    "currencyPair": "XAU/INR",
                                    "blockedQuantity": null
                                },
                                {
                                    "balQuantity": null,
                                    "currencyPair": "XAG/INR",
                                    "blockedQuantity": null
                                }
                            ],
                            "gold": {
                                "investedAmount": null,
                                "currentAmount": null,
                                "profitORloss": null,
                                "percent": null
                            }
                            ,

                            "silver": {
                                "investedAmountSilver": null,
                                "currentAmountSilver": null,
                                "profitORlossSilver": null,
                                "percentSilver": null
                            },

                            augmont: await passbook(req, res),
                            
                            // "p2p": {
                            //     "current_investments": current_investments,
                            //     "past_investments": past_investments

                            // },


                        }
                    ]

                });
            }
        } catch (error) {
            console.log(error)

            const errorMessage = JSON.parse(error.message);
            const errorReason = errorMessage.reason;
            const errorCode = errorMessage.code;

            return res.json({
                "error": true,
                "message": errorReason,
                "data": [],
                "code": errorCode
            })
        }
    }


    static async isPin(req, res) {


        const { pinCode } = req.body;
        const data = { pinCode }



        try {
            const response = await userMMtc.isPinCodeServiceable(data, res);


            return res.json({
                "error": false,
                "message": "success",
                "data": response
            });

        }
        catch (error) {
            console.log(error)

            const errorMessage = JSON.parse(error.message);
            const errorReason = errorMessage.reason;
            const errorCode = errorMessage.code;

            return res.json({
                "error": true,
                "message": errorReason,
                "data": null,
                "code": errorCode
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