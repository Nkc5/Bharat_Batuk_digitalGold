
const mongoose = require('mongoose');


const stateSchema = new mongoose.Schema({
    id: {
        type: Number
    },

    name: {
        type: String
    },

    country_id: {
        type: Number
    },
    status: {
        type: Number,
        default: 1

    }
})


const stateModel = mongoose.model('state', stateSchema);

module.exports = stateModel;