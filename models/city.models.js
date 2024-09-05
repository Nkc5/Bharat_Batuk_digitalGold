
const mongoose = require('mongoose');


const citySchema = new mongoose.Schema({
    id: {
        type: Number
    },

    city_name: {
        type: String
    },

    country_id: {
        type: String
    },
    state_id: {
        type: String
    },
    status: {
        type: Number,
        default: 1
    },
    // district_name: String,

    // district_code: String,
    // city_code: Number

})


const cityModel = mongoose.model('city', citySchema);

module.exports = cityModel;