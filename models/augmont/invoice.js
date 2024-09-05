
// const {augmontDatabase} = require('../../db');
const mongoose = require('mongoose');
// const db= augmontDatabase();





const buyInvoiceSchema = new mongoose.Schema({

}, { strict: false, timestamps: true });

const buyInvoiceModel = mongoose.model('buy_invoice', buyInvoiceSchema);



const redeemInvoiceSchema = new mongoose.Schema({

}, { strict: false, timestamps: true });

const redeemInvoiceModel = mongoose.model('redeem_invoice', redeemInvoiceSchema);


const sellInvoiceSchema = new mongoose.Schema({

}, { strict: false, timestamps: true });

const sellInvoiceModel = mongoose.model('sell_invoice', sellInvoiceSchema);


module.exports = {
    buyInvoiceModel,
    redeemInvoiceModel,
    sellInvoiceModel
}