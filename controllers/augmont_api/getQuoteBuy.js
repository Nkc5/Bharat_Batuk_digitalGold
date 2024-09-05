
const createUserAccount = require('./create_user.js');
const buyReqModel = require('../../models/augmont/buy_request.js');
const ratesModel = require('../../models/augmont/Gold_silver_rates.js');
const { userAddressCreate } = require('./address_augmont.js');
const { kycUpdate } = require('./kyc_user.js')
const { userAugmontModel, tokenAugmontModel } = require('../../models/augmont/user_augmont');
const crypto = require('crypto');



const getQuoteBuyAugmont = async (req, res) => {

    const customerRefNo = req.user._id.toString();
    const { metalType, quantity, amount } = req.body;
    const data = req.body;

    const merchantTransactionId = crypto.randomUUID();

    try {

        const userAugmont = await userAugmontModel.findOne({ customerRefNo }).sort({ _id: -1 });

        if (!userAugmont || !userAugmont.customerMappedId) {
            var userCreateResponse = await createUserAccount(customerRefNo, req.user.name);
            var addressCreate = await userAddressCreate(customerRefNo, req.user.name, req.user.phone);
            var kyc = await kycUpdate(customerRefNo, req.user.dob);

            console.log("userCreateResponse", userCreateResponse)
            console.log("addressCreate", addressCreate);
            console.log("kycUpdate", kyc);    

            
        if (kyc.message === "pan details required") {
            return res.status(400).json({
                error: true,
                message: kyc.message,
                data: []
            })
        }

        }

        const rates = await ratesModel.findOne({}).sort({ _id: -1 });

        const amountAfterTax = amount ? Number(amount) * 103 / 100 : metalType == "gold" ? Number(quantity) * Number(rates.gBuy) * 103 / 100 : Number(quantity) * Number(rates.sBuy) * 103 / 100;

        const gst = amount ? (Number(amount) * 3 / 100) : metalType === "gold" ? Number(quantity) * Number(rates.gBuy) * 3 / 100 : Number(quantity) * Number(rates.sBuy) * 3 / 100;

        const totalQuantity = amount && metalType === "gold" ? amount / Number(rates.gBuy) : amount && metalType === "silver" ? amount / Number(rates.sBuy) : Number(quantity);

        console.log("totalQuantity", totalQuantity)

        if (quantity && metalType == "gold") {
            var totalAmount = Number(quantity) * Number(rates.gBuy);
        }
        else if (quantity && metalType == "silver") {
            var totalAmount = Number(quantity) * Number(rates.sBuy);
        }

        console.log("amountAfterTax", amountAfterTax);

        const dbResponse = await buyReqModel.create({
            customerRefNo,
            ...data,
            pricePerGram: metalType === "gold" ? rates.gBuy : rates.sBuy,
            merchantTransactionId,
            blockId: rates.blockId,
            goldPrice: metalType === "gold" ? rates.gBuy : null,
            silverPrice: metalType === "silver" ? rates.sBuy : null
        })

        return res.status(200).json({
            error: false,
            message: 'success',
            data: [{
                ...dbResponse.toObject(),
                totalQuantity: String(Math.trunc(totalQuantity * 10 ** 4) / 10 ** 4),
                totalAmount: totalAmount ? String(Math.round(totalAmount * 10 ** 2) / 10 ** 2) : amount,
                gst: String(Math.round(gst * 10 ** 2) / 10 ** 2),
                amountAfterTax: String(Math.round(amountAfterTax * 10 ** 2) / 10 ** 2)
            }]
        })


    } catch (error) {
        console.log("error", error.message);

        return res.status(400).json({
            error: true,
            message: error.message,
            data: []
        })
    }


}


module.exports = getQuoteBuyAugmont;