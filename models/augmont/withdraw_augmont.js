
// const {augmontDatabase} = require('../../db');
const mongoose = require('mongoose');
// const db= augmontDatabase();

const withSchema = new mongoose.Schema({

}, {strict: false, timestamps: true});

const withdrawModel = mongoose.model('withdraw_augmont', withSchema);

module.exports = {
    withdrawModel
}