
const mongoose = require('mongoose');

const redeemSchema = new mongoose.Schema({
is_deleted: {
    type: Number,
    default: 0
}
}, {strict: false, timestamps: true});

const redeemModel = mongoose.model('redeems', redeemSchema);

module.exports = redeemModel;
