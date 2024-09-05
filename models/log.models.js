
const mongoose = require('mongoose');


const logSchema = new mongoose.Schema({


    action: String,
    timestamp: { type: Date, default: Date.now },
    oldData: mongoose.Schema.Types.Mixed,
    newData: mongoose.Schema.Types.Mixed,


})


const logModel = mongoose.model('log', logSchema);

module.exports = logModel;