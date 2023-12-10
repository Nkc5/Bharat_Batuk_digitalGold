const mongoose = require('mongoose');

const country_Schema = mongoose.Schema({
    id:{
        type: Number
    },
    name:{
        type: String
    },
    flag:{
        type:String
    },
    iso_code:{
        type:String
    },
    phone_code:{
        type:String
    },
    status:{
        type:Number,
        default: 1
    },
});
const countryModel = mongoose.model('country',country_Schema) 
  
module.exports = countryModel