const mongoose = require('mongoose');


const panSchema = new mongoose.Schema({



    "customerRefNo": {
        type: String,
    },

    "msg": {
        "LastUpdate": String,
        "Name": String,
        "NameOnTheCard": String,
        "PanHolderStatusType": String,
        "PanNumber": String,
        "STATUS": String,
        "StatusDescription": String,
        "panHolderStatusType": String,
        "source_id": Number,
        "dob": String,
        "email": String

    },
    "status": Number

}, { timestamps: true })


const panModel = mongoose.model('pan', panSchema)

module.exports = panModel