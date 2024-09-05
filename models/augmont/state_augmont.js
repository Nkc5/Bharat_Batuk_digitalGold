
const mongoose = require('mongoose');

const stateSchema = new mongoose.Schema({

}, {strict: false});

const stateModel = mongoose.model('state_augmont', stateSchema);

module.exports = stateModel;
