const crypto = require('crypto');
const sellRequestModel = require('../../models/augmont/sell_request.js');
const ratesModel = require('../../models/augmont/Gold_silver_rates.js');



const getQuoteSell = async (req, res) =>{

    var  {metalType, amount, quantity} = req.body;

    try {
    
    const merchantTransactionId = crypto.randomUUID();
    const rates = await ratesModel.findOne({}).sort({_id:-1});

    const totalQuantity = amount && metalType ==="gold" ? Number(amount/rates.gSell) : amount && metalType ==="silver" ? Number(amount/rates.sSell) : quantity;

    const totalAmount = quantity && metalType==="gold" ? Number(rates.gSell * quantity) : quantity && metalType === "silver" ? Number(quantity * rates.sSell) : amount;

    console.log("totalQuantity", totalQuantity)

    const dbResponse = await sellRequestModel.create({
        customerRefNo: req.user._id.toString(),
        ...req.body,
         merchantTransactionId,
         blockId: rates.blockId,
         pricePerGram: metalType ==="gold" ? rates.gSell : rates.sSell,
    })


    return res.status(200).json({
        error: false,
        message: 'succes',
        data: [{
            ...dbResponse.toObject(),
            totalQuantity: String(Math.trunc(totalQuantity * 10**4)/10**4),
            gst: "0",
            totalAmount: String(Math.round(totalAmount * 10 ** 2)/10 ** 2),
            amountAfterTax: String(Math.round(totalAmount * 10 ** 2)/10 ** 2)
    }]
    })

        
} catch (error) {
    console.log("error", error);
    return res.status(400).json({
        error: true,
        message: error.message,
        data: []
    })
}



}

module.exports = getQuoteSell;