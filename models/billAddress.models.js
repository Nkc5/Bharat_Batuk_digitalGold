const mongoose=require('mongoose')

const billaddressSchema=new mongoose.Schema({
  id: {
    type: String,
    default: null
  },   
  city:String,
  country:String,
  customerRefNo:{
    type: String,
    default: null
  },
  usercustomerRefNo: String,
  line1:String,
  line2:String,
  mobileNumber:String,
  name:String,
  state:String,
  statecode:String,
  type:String,
  zip:String,
 "is_deleted":{
    type: Number,
    default: false
  }

})

const billAddressModel = mongoose.model('billAddress',billaddressSchema);

module.exports=billAddressModel;