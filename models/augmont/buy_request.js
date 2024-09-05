
const mongoose = require('mongoose');

const buyReqSchema = new mongoose.Schema({

}, {strict: false, timestamps: true});

const buyReqModel = mongoose.model('buy_req_augmont', buyReqSchema);

module.exports = buyReqModel;