const mongoose = require('mongoose');

// Define Company schema
const companySchema = new mongoose.Schema({
  name: String,
});



// Define Login schema
const loginSchema = new mongoose.Schema({
  company_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
  },
  email: String,
  password: String,
  sessionID: String,
});

// Combine both schemas into a single model
const companyModel = mongoose.model('company', companySchema);
const loginModel = mongoose.model('login', loginSchema);

module.exports = {
  companyModel,
  loginModel
}
