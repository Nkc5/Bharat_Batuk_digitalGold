const stateModel = require('../../models/state.models.js');

class StateCodeController {
  static stateCodesIndia = [
    { state_code: 35, iso_code: 'AN', name: 'Andaman and Nicobar Islands', status: 1 },
    { state_code: 28, iso_code: 'AP', name: 'Andhra Pradesh', status: 1 },
    { state_code: 37, iso_code: 'AD', name: 'Andhra Pradesh(New)', status: 1 },
    { state_code: 12, iso_code: 'AR', name: 'Arunachal Pradesh', status: 1 },
    { state_code: 18, iso_code: 'AS', name: 'Assam', status: 1 },
    { state_code: 10, iso_code: 'BH', name: 'Bihar', status: 1 },
    { state_code: 4, iso_code:  'CH', name: 'Chandigarh', status: 1 },
    { state_code: 22, iso_code: 'CT', name: 'Chhattisgarh', status: 1 },
    { state_code: 26, iso_code: 'DN', name: 'Dadra and Nagar Haveli', status: 1 },
    { state_code: 25, iso_code: 'DD', name: 'Daman and Diu', status: 1 },
    { state_code: 7, iso_code: 'DL', name: 'Delhi', status: 1 },
    { state_code: 30, iso_code:  'GA', name: 'Goa', status: 1 },
    { state_code: 24, iso_code: 'GJ', name: 'Gujarat', status: 1 },
    { state_code: 6, iso_code: 'HR', name: 'Haryana', status: 1 },
    { state_code: 2, iso_code:  'HP', name: 'Himachal Pradesh', status: 1 },
    { state_code: 1, iso_code:  'JK', name: 'Jammu and Kashmir', status: 1 },
    { state_code: 20, iso_code:  'JH', name: 'Jharkhand', status: 1 },
    { state_code: 29, iso_code: 'KA', name: 'Karnataka', status: 1 },
    { state_code: 32, iso_code: 'KL', name: 'Kerala', status: 1 },
    { state_code: 31, iso_code: 'LD', name: 'Lakshadweep Island', status: 1 },
    { state_code: 23, iso_code: 'MP', name: 'Madhya Pradesh', status: 1 },
    { state_code: 27, iso_code: 'MH', name: 'Maharashtra', status: 1 },
    { state_code: 14, iso_code: 'MN', name: 'Manipur', status: 1 },
    { state_code: 17, iso_code: 'ME', name: 'Meghalaya', status: 1 },
    { state_code: 15, iso_code: 'Ml', name: 'Mizoram', status: 1 },
    { state_code: 13, iso_code: 'NL', name: 'Nagaland', status: 1 },
    { state_code: 21, iso_code: 'OR', name: 'Odisha', status: 1 },
    { state_code: 34, iso_code: 'PY', name: 'Puducherry', status: 1 },
    { state_code: 3, iso_code: 'PB', name: 'Punjab', status: 1 },
    { state_code: 8, iso_code: 'RJ', name: 'Rajasthan', status: 1 },
    { state_code: 11, iso_code: 'SK', name: 'Sikkim', status: 1 },
    { state_code: 33, iso_code: 'TN', name: 'Tamil Nadu', status: 1 },
    { state_code: 36, iso_code: 'TS', name: 'Telangana', status: 1 },
    { state_code: 16, iso_code: 'TR', name: 'Tripura', status: 1 },
    { state_code: 9, iso_code: 'UP', name: 'Uttar Pradesh', status: 1 },
    { state_code: 5, iso_code: 'UT', name:  'Uttarakhand', status: 1 },
    { state_code: 19, iso_code: 'WB', name: 'West Bengal', status: 1 },
   
  ];

  static async insertStateCodes(req, res) {
    try {
      // Insert the state codes into the collection
      const result = await stateModel.insertMany(StateCodeController.stateCodesIndia);

      console.log(`${result.insertedCount} state codes inserted successfully.`);
      res.status(200).json({ message: `${result.insertedCount} state codes inserted successfully.` });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  
static getstateCode = async(req,res) => {
const state = await stateModel.find({})
return res.json(state)
}

}

module.exports = StateCodeController;
