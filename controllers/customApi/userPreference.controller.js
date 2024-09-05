// preferenceController.js

// Importing the Preference model and mongoose
const Preference = require('../../models/preference.models.js');
const logAction = require('./logAction.controller.js');

const mongoose = require('mongoose');

// Creating a class for the preferenceController
class preferenceController {
  constructor() {

  }

  // Method to add preference
  async addPreference(req, res) {
    try {
      // Extracting user ID from the request object
      const customerRefNo = req.user._id.toString();


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
        feedback,
        instruments
      } = req.body;


      // Initializing error string
      // let errors = "";

      // // Check each field and accumulate error messages
      // if (!customerRefNo) {
      //   errors += "Please enter your customer_ref. ";
      // }

      // if (!incomeRange) {
      //   errors += "Please enter your income range. ";
      // }

      // if (!occupation) {
      //   errors += "Please enter your occupation. ";
      // }

      // if (!MartialStatus) {
      //   errors += "Please enter your MartialStatus. ";
      // }

      // if (!investment) {
      //   errors += "Please enter your investment. ";
      // }

      // if (!app_use) {
      //   errors += "Please enter app use. ";
      // }

      // if (!savingPercentage) {
      //   errors += "Please enter your saving percentage. ";
      // }

      // if (!savingsFor) {
      //   errors += "Please enter your savings for. ";
      // }

      // if (!language) {
      //   errors += "Please enter your language. ";
      // }

      // if (!speakAboutBatuk) {
      //   errors += "Please enter your speakAboutBatuk.";
      // }

      // if (!featuresInBatuk) {
      //   errors += "Please enter your features. ";
      // }

      // if (!featuresToAdd) {
      //   errors += "Please enter your features. ";
      // }

      // if (!dontLike) {
      //   errors += "Please enter your don't like. ";
      // }

      // if (!feedback) {
      //   errors += "Please Enter your feedback. ";
      // }

      // if (!instruments) {
      //   errors += "Please Enter your instruments. ";
      // }
      // // Trim to remove trailing space
      // errors = errors.trim();

      // // Check if there are any errors
      // if (errors !== "") {
      //   return res.status(400).json({
      //     error: true,
      //     message: errors,
      //     data: [],
      //   });
      // }

      
      const has_preference = (await Preference.find({customerRefNo})).length > 0;
      if (has_preference) {
        return res.status(400).json({
          error: true,
          message: 'Preference already present for current user',
        });
      }

      // Creating a new preference record using the Preference model
      const response = await Preference.create({
        customerRefNo,
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
        feedback,
        instruments
      });


      // logger
      const logResponse = await logAction.log("add preference", null, response);

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
      return res.status(400).json({
        error: true,
        message: 'Internal server error',
        data: []
      });
    }
  }

  //update preference
  async updatePreference(req, res) {

    const customerRefNo = req.user._id;

    const {_id, ...data} = req.body; // Extracting request body data

    try {

      const oldDocument = await Preference.findOne({$and: [{customerRefNo}, {_id}]});

      // Finding and updating the preference based on the customer reference
      const updatePreference = await Preference.findOneAndUpdate(
        {$and: [{customerRefNo}, {_id}]}, // Query to find the preference by customer reference
        data,
        { new: true } // To return the updated preference
      );

      // old document

      // logger
      const logResponse = await logAction.log("update preference", oldDocument, updatePreference);


      console.log(updatePreference); // Logging the updated preference

      if (!updatePreference) {
        // If no preference is found for the provided customer reference
        return res.status(400).json({
          error: true,
          message: "Preference not found",
          data: [],
        });
      }

      // Sending a success response with the updated preference data
      return res.status(200).json({
        error: false,
        message: "Preference updated successfully",
        data: [updatePreference],
      });
    } catch (err) {
      // Handling any caught errors and sending an error response
      console.error(err);
      return res.status(400).json({
        error: true,
        message: 'Something Went Wrong',
        data: [],
      });
    }
  }



  //listPreference
  async listPreference(req, res) {
    const customerRefNo = req.user._id;

    // const {_id} = req.headers;
    
    console.log(customerRefNo);

    try {
      // Find the user by their ID
      const preference = await Preference.findOne({customerRefNo})
      console.log(preference);

      if (preference) {
        return res.json({
          error: false,
          message: 'Preference found successfully',
          data: [preference]
        });
      } else {
        return res.status(400).json({
          error: true,
          message: 'Preference not found',
          data: []
        });
      }
    } catch (error) {
      console.error('Error:', error); // Log the error for debugging
      return res.status(400).json({
        error: true,
        message: 'Something Went Wrong',
        data: []
      });
    }
  }

}

module.exports = preferenceController;
