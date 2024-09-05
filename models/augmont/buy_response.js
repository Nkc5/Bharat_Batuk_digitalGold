
const mongoose = require('mongoose');

const buySchema = new mongoose.Schema({

}, {strict: false, timestamps: true});

const buyModel = mongoose.model('buy_augmont', buySchema);

module.exports = {
    buyModel
}