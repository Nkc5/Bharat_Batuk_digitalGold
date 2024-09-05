const mongoose=require('mongoose');


const goldSchema = new mongoose.Schema({
    // customerRefNo: String,
    
        gBuy: String,
        gSell: String,
        sBuy: String,
        sSell: String,
        gBuyGst: String,
        sBuyGst: String,
    
    taxes: Array, // Make sure this matches the actual structure in your data
    blockId: String,
},{ timestamps: true });

const goldRates = mongoose.model('gold_augmont', goldSchema);
module.exports=goldRates