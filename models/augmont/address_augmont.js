
const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
is_deleted: {
    type: Number,
    default: 0
}
}, {strict: false, timestamps: true});

const addressModel = mongoose.model('address_augmont', addressSchema);

module.exports = addressModel;
