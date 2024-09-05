

const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
    token_augmont: String
})

const tokenAugmontModel = mongoose.model('token_augmont', tokenSchema);


const userSchema = new mongoose.Schema({
    token_augmont: String,
    customerRefNo: String,
    uniqueId: String,
    customerMappedId: String,
    bank_id: String,

})

const userAugmontModel = mongoose.model('user_augmont', userSchema);


module.exports = {
    tokenAugmontModel,
    userAugmontModel
};