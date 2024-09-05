
const mongoose = require('mongoose');

const buyRequestSchema = new mongoose.Schema({

}, {strict: false, timestamps: true});

const buyRequestModel = mongoose.model('buy_request', buyRequestSchema);

module.exports = buyRequestModel;