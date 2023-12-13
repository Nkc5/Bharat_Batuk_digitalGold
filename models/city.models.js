
const mongoose = require('mongoose');


const citySchema = new mongoose.Schema({
    id: {
        type : Number
    },

    name : {
        type: String
    },

    country_id : {
        type: Number
    },
    state_id:{
        type: Number
    },
    status: {
        type: Number,
        default: 1
    },
    district_name: String,
    
    distric_code: Number

})


const cityModel = mongoose.model('city', citySchema);

module.exports = cityModel;