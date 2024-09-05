
const mongoose=require('mongoose')


const finzeeSchema=new mongoose.Schema({
    "customerRefNo": {
        type: String,
    },
    lenderId:{
        type:String,
    }
    
})
const finzeeModel = mongoose.model('finzee', finzeeSchema)
module.exports=finzeeModel;