// preferenceController.js

//const connection = require('../../connection');
const Preference = require('../../models/preference.models.js');

const mongoose=require('mongoose');


class preferenceController {                                                               
  constructor() {
    this.customer_ref = "";
  }

  

  // ADD PREFERENCE
  async addPreference(req, res) {
  const customer_ref= req.user._id
    const {
  
      incomeRange,
      occupation,
      MartialStatus,
      investment,
      app_use,
      savingPercentage,
      savingsFor,
      language,
      speakAboutBatuk,
       featuresInBatuk,
       featuresToAdd,
      dontLike,
      feedback
    } = req.body;
    
    let errors = "";

    // Check each field and accumulate error messages
    if (!customer_ref) {
      errors += "Please enter your customer_ref. ";
    }

    if (!incomeRange) {
      errors += "Please enter your income range. ";
    }

    if (!occupation) {
      errors += "Please enter your occupation. ";
    }
    
    if (!MartialStatus) {
      errors += "Please enter your MartialStatus. ";
    }
    
    if (!investment) {
      errors += "Please enter your investment. ";
    }

    if (!app_use) {
      errors += "Please enter app use. ";
    }

    if (!savingPercentage) {
      errors += "Please enter your saving percentage. ";
    }

    if (!savingsFor) {
      errors += "Please enter your savings for. ";
    }

    if (!language) {
      errors += "Please enter your language. ";
    }

    if (!speakAboutBatuk) {
      errors += "Please enter your speakAboutBatuk.";
    }
    
    if (!featuresInBatuk) {
      errors += "Please enter your features. ";
    }
    
    if (!featuresToAdd) {
      errors += "Please enter your features. ";
    }
    

    if (!dontLike) {
      errors += "Please enter your don't like. ";
    }

    if (!feedback) {
      errors += "Please Enter your feedback. ";
    }

    // Trim to remove trailing space
    errors = errors.trim();

    // Check if there are any errors
    if (errors !== "") {
      return res.status(400).json({
        error: true,
        message: errors,
        data: [],
      });
    }


    try {
      const response = await Preference.create({
        customer_ref,
        incomeRange,
        occupation,
        MartialStatus,
        investment,
        app_use,
        savingPercentage,
        savingsFor,
        language,
        speakAboutBatuk,
        featuresInBatuk,
        featuresToAdd,
        dontLike,
        feedback
      });
console.log(response);

      return res.status(200).json({
        error: false,
        message: "Preference Added Successfully",
        data: [response]
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        error: true,
        message: 'Internal server error',
        data: [null]
      });
    }
  }
  
  // UPDATE PREFERENCE
async updatePreference(req, res) {
  const data = req.body;
  const { customer_ref } = req.body;

  try {
    if (!customer_ref) {
      return res.status(400).json({
        error: true,
        message: "Please provide customer_ref",
        data: null
      });
    }

    const updatedPreference = await Preference.findOneAndUpdate(
      { customer_ref },
      data,
      { new: true }
    );
     console.log(updatedPreference)

    if (!updatedPreference) {
      return res.status(400).json({
        error: true,
        message: "Failed to update!!",
        data: null
      });
    }
    
    return res.status(200).json({
      error: false,
      message: "Updated Successfully",
      data: [updatedPreference]
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: true,
      message: "Internal server error",
      data: []
    });
  }
}

  // LIST PREFERENCE
  async listPreference(req, res) {
  
  const userId = req.params.id;
  
    try {
      // Check if userId is a valid ObjectId before attempting to query the database
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({


          error: true,
          message: 'Invalid user ID format',
          data: [null],
        });
      }
  
      // Find the user by their ID
      const user = await Preference.findById(userId);
  
      if (user) {
        return res.json({
          error: false,
          message: 'User found successfully',
          data: [user],
        });
      } else {
        return res.status(404).json({
          error: true,
          message: 'User not found',
          data: [null],
        });
      }
    } catch (error) {
      console.error('Error:', error); // Log the error for debugging
      return res.status(500).json({
        error: true,
        message: 'Internal server error',
        data: null,
      });
    }
}
}

module.exports = preferenceController;
