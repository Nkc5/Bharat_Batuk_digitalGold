
// const {augmontDatabase} = require('../../db');
const mongoose = require('mongoose');
// const db= augmontDatabase();

const sellSchema = new mongoose.Schema({

}, {strict: false, timestamps: true});

const sellModel = mongoose.model('sell_augmont', sellSchema);

module.exports = {
    sellModel
}