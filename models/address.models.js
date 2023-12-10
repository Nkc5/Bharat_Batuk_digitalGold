const mongoose=require('mongoose')

// delievery address
const addressSchema=new mongoose.Schema({
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

const addressModel = mongoose.model('address',addressSchema);

module.exports=addressModel;