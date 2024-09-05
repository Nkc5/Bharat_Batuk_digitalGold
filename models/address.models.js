const mongoose = require('mongoose')

// delievery address
const addressSchema = new mongoose.Schema({
  id: {
    type: String,
    default: null
  },
  city: String,
  country: String,
  mmtc_customer_ref: {
    type: String,
    default: null
  },
  userAddressId: {
    type: String,
    default: null
  },
  userAccountId: String,
  customerRefNo: String,
  line1: String,
  line2: String,
  mobileNumber: String,
  name: String,
  state: String,
  statecode: String,
  type: String,
  zip: Number,
  "is_deleted": {
    type: Number,
    default: 0
  }

})

const addressModel = mongoose.model('address', addressSchema);

module.exports = addressModel;