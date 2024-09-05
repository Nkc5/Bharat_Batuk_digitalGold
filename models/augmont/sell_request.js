
const mongoose = require('mongoose');


const sellRequestSchema = new mongoose.Schema({

}, {strict: false, timstamps: true})

const sellRequestModel = mongoose.model('sell_request', sellRequestSchema);

module.exports = sellRequestModel;