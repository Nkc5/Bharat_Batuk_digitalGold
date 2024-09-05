
const mongoose=require('mongoose')
const bankSchema=new mongoose.Schema({
    "customerRefNo": {
        type: String,
    },
  "msg":{
    "description":String,
    "name":String,
    "status":String,
    "transID":String,
    "tsTransID":String,
   
    "Bankname":String,
    "Branchname":String,
    "account_no":String,
    "ifsc":String

},
  "status":Number,
},{ timestamps: true })

const bankModel=mongoose.model('bank',bankSchema);
module.exports=bankModel

