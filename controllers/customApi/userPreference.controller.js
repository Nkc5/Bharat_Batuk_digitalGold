// preferenceController.js

// Importing the Preference model and mongoose
const Preference = require('../../models/preference.models.js');

const mongoose=require('mongoose');

// Creating a class for the preferenceController
class preferenceController {                                                               
  constructor() {
    // Initializing customer_ref property
    //this.customer_ref = "";
  }

  

  
  // Method to add preference
  async addPreference(req, res) {
    // Extracting user ID from the request object
  const usercustomerRefNo= req.user._id;
  
    // Destructuring request body for various preference fields
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

    
    // Initializing error string
    let errors = "";

    // Check each field and accumulate error messages
    if (!usercustomerRefNo ){
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
       // Creating a new preference record using the Preference model
      const response = await Preference.create({
        usercustomerRefNo,
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
      // Logging the response from the database
   console.log(response);
      // Returning a success response

      return res.status(200).json({
        error: false,
        message: "Preference Added Successfully",
        data: [response]
      });
    } catch (err) {
       // Handling any errors that may occur during the database operation
      console.error(err);
      return res.status(500).json({
        error: true,
        message: 'Internal server error',
        data: [null]
      });
    }
  }
  
  //UPDATE PREFERENCE
  // async updatePreference(req, res) {
  //   const data = req.body; // Extracting the data from the request body
  //   console.log(data); // Logging the received data
  
  //   const customer_ref = req.user._id; // Extracting the customer reference ID from the request user object
  //   console.log(customer_ref); // Logging the customer reference ID
  
  //   try {
  //     if (!customer_ref) { // Checking if customer_ref is missing
  //       return res.status(400).json({
  //         error: true,
  //         message: "Please provide customer_ref",
  //         data: null
  //       });
  //     }
  
  //     // Finding and updating a preference based on the customer reference ID
  //     const updatedPreference = await Preference.findOneAndUpdate(
  //       { "usercustomerRefNo": customer_ref }, // Query to find the preference by customer reference
  //       data, // New data to update the preference with
  //       { new: true } // To return the updated preference
  //     );
  //     console.log(updatedPreference); // Logging the updated preference
  
  //     if (!updatedPreference) { // Checking if preference update failed
  //       return res.status(400).json({
  //         error: true,
  //         message: "Failed to update!!",
  //         data: null
  //       });
  //     }
      
  //     // Sending a success response with the updated preference data
  //     return res.status(200).json({
  //       error: false,
  //       message: "Updated Successfully",
  //       data: [updatedPreference]
  //     });
  //   } catch (err) {
  //     // Handling any caught errors and sending an error response
  //     console.error(err);
  //     return res.status(500).json({
  //       error: true,
  //       message: "Internal server error",
  //       data: []
  //     });
  //   }
  // }

  async updatePreference(req, res) {
    try {
      const data = req.body; // Extracting request body data
      // this.customer_ref = req.user._doc._id; // Storing customer reference ID (not used in the provided code)
  
      // Finding and updating the nominee based on the customer reference
      const updatePreference = await Preference.findOneAndUpdate(
        { customer_ref: this.customer_ref }, // Query to find the nominee by customer reference
        data, // Data to update the nominee with
        { new: true } // To return the updated nominee
      );
  
      console.log(updatePreference); // Logging the updated nominee
  
      if (!updatePreference) {
        // If no nominee is found for the provided customer reference
        return res.status(404).json({
          error: true,
          message: "Preference not found",
          data: null,
        });
      }
  
      // Sending a success response with the updated nominee data
      return res.status(200).json({
        error: false,
        message: "Preference updated successfully",
        data: [updatePreference],
      });
    } catch (err) {
      // Handling any caught errors and sending an error response
      console.error(err);
      return res.status(500).json({
        error: true,
        message: "Internal server error",
        data: [],
      });
    }
  }
  
  

//listPreference
async listPreference(req, res) {
  const customerRefNo = req.user._id;

  console.log(customerRefNo);

  try {
    // Find the user by their ID
    const user = await Preference.findOne({ "usercustomerRefNo": customerRefNo });
    console.log(user);

    if (user) {
      return res.json({
        error: false,
        message: 'Preference found successfully',
        data: user
      });
    } else {
      return res.status(404).json({
        error: true,
        message: 'Preference not found',
        data: null
      });
    }
  } catch (error) {
    console.error('Error:', error); // Log the error for debugging
    return res.status(500).json({
      error: true,
      message: 'Internal server error',
      data: null
    });
  }
}

}

module.exports = preferenceController;
