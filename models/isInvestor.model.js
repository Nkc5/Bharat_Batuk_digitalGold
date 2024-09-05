const mongoose = require('mongoose');

const investorDataSchema = new mongoose.Schema({
    customerRefNo:String,
    investorId:{
      type:  String,
      trim: true     
    },
    banking_id:String,


/***********************************  Scheme *************************************/
scheme_id:Number,
investment_type:String,
shceme_mhp:Number,
payout_type:String,
roi:Number,
interest_calculation_type:String,
scheme_type:String,
scheme_name:String,
double_advantage_scheme:String,
lockin_type:String,
min_amount:Number,
max_amount:Number,


/**************************************Dashboard **************************************************/

current_value:Number,
withdrawable_amount:Number,
locked_in_amount_bal:Number,
flexi_locked_in_withdrawable_amount:Number,
total_principal_investment:Number,
annualized_return:Number,
requested_investment:Number,
requested_withdrawal:Number,
capitalised_interest:Number,
original_npi:Number











    // Add other fields as needed
});

const InvestorData = mongoose.model('InvestorData', investorDataSchema);

module.exports = InvestorData;
