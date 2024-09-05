// Importing the nomineeModel, validator, and mongoose
const nomineeModel = require('../../models/nominee.models.js');
const validator = require('validator');
const mongoose = require('mongoose')
const logAction = require('./logAction.controller.js');


class NomineeController {
  constructor() {
    // Initializing customer_ref property
    //  this.customer_ref = '';
  }


  // Method to add nominee
  async addNominee(req, res) {
    try {
      // Destructuring request body for various nominee fields

      const { name, phone, email, relation, dob } = req.body;

      // const usercustomerRefNo= req.user._id;   
      const customerRefNo = req.user._id;
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
          data: [],
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
      const has_nominee = (await nomineeModel.find({customerRefNo })).length > 0;
      if (has_nominee) {
        return res.status(400).json({
          error: true,
          message: 'Nominee already present for current user',
        });
      }

      const user = await nomineeModel.create({
        customerRefNo,
        name,
        phone,
        email,
        relation,
        dob
      });
      // Logging the created user
      console.log('user', user);


      // logger
      const logResponse = await logAction.log("add nominee", null, user);


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
        message: 'Something Went Wrong',
        data: [],
      });
    }
  }

  // Update nominee
  // async updateNominee(req, res){

  //   const {_id} = req.headers;

  //   if(!_id){
  //     return res.status(400).json({
  //       error: true,
  //       message: "no _id found",
  //       data: []
  //     })
  //   }



  //   try {
  //     const {phone,email, ...data} = req.body; // Extracting request body data
  //     const customerRefNo = req.user._id.toString(); // Storing customer reference ID (not used in the provided code)
      
      
  //   if (!validator.isEmail(email)) {
  //     return res.status(400).json({
  //       error: true,
  //       message: "Email is not valid.",
  //       data: [null],
  //     });
  //   }
  //   let errors = "";
  //   if (!phone) {
  //     errors += "Please enter your mobile number. ";
  //   } else if (!/^\d{10}$/.test(phone)) {
  //     // Check if mobileNumber is not 10 digits
  //     errors += "Mobile number must be 10 digits. ";
  //   }
  //   if (errors !== "") {
  //     return res.status(400).json({
  //       error: true,
  //       message: errors.trim(), // Trim to remove trailing space
  //       data: [],
  //     });
  //   }


  //     const oldDocument = await nomineeModel.findOne({$and: [{customerRefNo}, {_id}]});
      
  //     // Finding and updating the nominee based on the customer reference
  //     const updatedNominee = await nomineeModel.findOneAndUpdate(
  //       {$and: [{customerRefNo}, {_id}]}, // Query to find the nominee by customer reference
  //       data, // Data to update the nominee with
  //       { new: true } // To return the updated nominee
  //     );

  //     console.log(updatedNominee); // Logging the updated nominee

  //     if (!updatedNominee) {
  //       // If no nominee is found for the provided customer reference
  //       return res.status(400).json({
  //         error: true,
  //         message: "Nominee not found",
  //         data: [],
  //       });
  //     }

  //     // oldDocument

  //     // logger
  //     await logAction.log("update nominee", oldDocument, updatedNominee);

      

  //     // Sending a success response with the updated nominee data
  //     return res.status(200).json({
  //       error: false,
  //       message: "Nominee updated successfully",
  //       data: [updatedNominee],
  //     });
  //   } catch (err) {
  //     // Handling any caught errors and sending an error response
  //     console.error(err);
  //     return res.status(400).json({
  //       error: true,
  //       message: 'Something Went Wrong',
  //       data: [],
  //     });
  //   }
  // }





  async  updateNominee(req, res) {
    try {
      const data = req.body;
      const phone = req.body.phone; // Assuming phone number is in the 'phone' field
      const email=req.body.email;
      const customer_ref = req.user._id;

      if (!validator.isEmail(email)) {
        return res.status(400).json({
          error: true,
          message: "Email is not valid.",
          data: [],
        });
      }
  
      let errors = ""; // Initialize errors variable
  
      if (!phone) {
        errors += "Please enter your mobile number. ";
      } else if (!/^\d{10}$/.test(phone)) {
        errors += "Mobile number must be 10 digits. ";
      }
  
      if (errors) {
        // If errors exist, return a validation error response
        return res.status(400).json({
          error: true,
          // message: "Validation Error",
         
          errors: errors.trim(),
          data: [], // Send the accumulated errors
        });
      }
  
      // Finding and updating the nominee based on the customer reference
      const updatedNominee = await nomineeModel.findOneAndUpdate(
        { customerRefNo: customer_ref }, // Query to find the nominee by customer reference
        data, // Data to update the nominee with
        { new: true } // To return the updated nominee
      );
  
      console.log("updatedNominee", updatedNominee); // Logging the updated nominee
  
      if (!updatedNominee) {
        // If no nominee is found for the provided customer reference
        return res.status(404).json({
          error: true,
          message: "Nominee not found",
          data: [],
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
        message: "Something Went Wrong",
        data: [],
      });
    }
  }


  

  //list nominee
  async listNominee(req, res) {
    const customerRefNo = req.user._id.toString();

    
   

    try {
      // Find the user's nominees and sort them by creation date in descending order
      const nominees = await nomineeModel.findOne({customerRefNo})


      if (nominees) {
        return res.status(200).json({
          error: false,
          message: 'nominee found successfully',
          data: [nominees]
        });
      } else {
        return res.status(400).json({
          error: true,
          message: 'No nominees found',
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
module.exports = NomineeController;

