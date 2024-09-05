
const mongoose = require('mongoose');

const bankSchema = new mongoose.Schema({
is_deleted: {
    type: Number,
    default: 0
}
}, {strict: false, timestamps: true});

const bankModel = mongoose.model('bank_augmont', bankSchema);

module.exports = bankModel;
