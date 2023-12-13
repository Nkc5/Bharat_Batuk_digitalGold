
// Importing the nomineeModel, validator, and mongoose
const nomineeModel = require('../../models/nominee.models.js');
const validator = require('validator');
const mongoose=require('mongoose')
// Creating a class for the NomineeController
class NomineeController {
  constructor() {
      // Initializing customer_ref property
    //  this.customer_ref = '';
  }
  

    // Method to add nominee
  async addNominee(req, res) {
    try {
       // Destructuring request body for various nominee fields
      
       const {name, phone, email, relation,dob } = req.body;
       
    const customerRefNo = req.user._id;
    const usercustomerRefNo = req.user._id;
    const data = { ...req.body, customerRefNo }
        // Initializing errors string
       let errors = "";
     
      if (!name) {
        errors += "Please enter your name. ";
      }
       // Validating email using the validator library
      if (!validator.isEmail(email)) {
        return res.status(400).json({
          error: true,
          message: "Email is not valid.",
          data: [null],
        });
      }

      if (!phone) {
        errors += "Please enter your mobile number. ";
      } else if (!/^\d{10}$/.test(phone)) {
        // Check if mobileNumber is not 10 digits
        errors += "Mobile number must be 10 digits. ";
      }

      if (!relation) {
        errors += "Please Enter Your Relation. ";
      }

      if (errors !== "") {
        return res.status(400).json({
          error: true,
          message: errors.trim(), // Trim to remove trailing space
          data: [],
        });
      }
      // Creating a new nominee record using the nomineeModel
      // const database = { ...result, usercustomerRefNo }
      const user = await nomineeModel.create({
        customer_ref: customerRefNo,
        name,
        phone,
        email,
        relation,
        dob
      });
          // Logging the created user
console.log('user',user);
// Returning a success response
      return res.json({
        error: false,
        message: 'Nominee added successfully',
        data: [user],
      });
    } catch (err) {
      // Handling any errors that may occur during the database operation
      console.error(err);
      return res.status(400).json({
        error: true,
        message: 'Unsuccessful',
        data: [],
      });
    }
  }

  // Update nominee
  async updateNominee(req, res) {
    try {
      const data = req.body; // Extracting request body data
      // this.customer_ref = req.user._doc._id; // Storing customer reference ID (not used in the provided code)
  
      // Finding and updating the nominee based on the customer reference
      const updatedNominee = await nomineeModel.findOneAndUpdate(
        { customer_ref: this.customer_ref }, // Query to find the nominee by customer reference
        data, // Data to update the nominee with
        { new: true } // To return the updated nominee
      );
  
      console.log(updatedNominee); // Logging the updated nominee
  
      if (!updatedNominee) {
        // If no nominee is found for the provided customer reference
        return res.status(404).json({
          error: true,
          message: "Nominee not found",
          data: null,
        });
      }
  
      // Sending a success response with the updated nominee data
      return res.status(200).json({
        error: false,
        message: "Nominee updated successfully",
        data: [updatedNominee],
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
  

  //list nominee
async listNominee(req, res) {
  const customerRefNo = req.user._id;

  console.log(customerRefNo);

  try {
    // Find the user by their ID
    const user = await nomineeModel.find({ "usercustomerRefNo": customerRefNo });
    console.log(user);

    if (user.length > 0) {
      return res.json({
        error: false,
        message: 'User found successfully',
        data: user
      });
    } else {
      return res.status(404).json({
        error: true,
        message: 'User not found',
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
module.exports = NomineeController;
