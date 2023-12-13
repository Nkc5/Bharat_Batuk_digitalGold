

const addressModel = require('../../models/address.models.js');
const billAddressModel = require('../../models/billAddress.models.js');
const userModel = require('../../models/user.models.js');
const mongoose = require('mongoose');
const userMMtc = require('../mmtcApi/user.controller')
//const i18n = require('i18n');

let city, country, customerRefNo, line1, mobileNumber, name, state, statecode, type, zip, line2;


class AddressController {
  constructor() {

  }

  async addAddress(req, res) {

    const {
      city,
      country,
      line1,
      state,
      statecode,
      type,
      zip,
      line2,
    } = req.body;


    const customerRefNo = req.user._id;
    const usercustomerRefNo = req.user._id;
    //  console.log(customerRefNo)
    const name = req.user.name;
    const mobileNumber = req.user.phone;



    const data = { ...req.body, customerRefNo, name, mobileNumber }
    const data2 = { ...req.body, usercustomerRefNo, name, mobileNumber }

    let errors = "";

    // Check each field and accumulate error messages
    if (!city) {
      errors += "Please enter your city. ";
    }
    if (!country) {
      errors += "Please enter your country. ";
    }

    if (!line1) {
      errors += "Please enter your line1. ";
    }

    if (!state) {
      errors += "Please enter your state. ";
    }
    if (!statecode) {
      errors += "Please enter your statecode. ";
    }
    if (!type) {
      errors += "Please enter your type. ";
    }
    if (!zip) {
      errors += "Please enter your zip. ";
    }
    if (!line2) {
      errors += "Please enter your line2. ";
    }


    errors = errors.trim();

    // Check if there are any errors
    if (errors !== "") {
      return res.status(400).json({
        error: true,
        message: errors,
        data: [null],
      });
    }


    // Make a cURL request to MMTC
    try {

      const usercustomerRefNo = req.user._id;
      // const user = await userModel.findOne({"_id": usercustomerRefNo})
      const mmtcCustRef = req.user.mmtc_customer_ref;
      console.log("mmtcCustRef", mmtcCustRef);

      if (mmtcCustRef) {
        console.log("yes mmtc customer")
        const result = await userMMtc.addUpdateAddress(data, res);
        console.log(result)

        const database = { ...result, usercustomerRefNo }
        console.log("database", database)

        //type = delievery address than save to delievery address database
        if (type === "D") {

          const newAddressArray = await addressModel.create(database)
          // console.log("addressModel", newAddressArray)


        }

        //type = billing address than save to billing address database
        else if (type === "B") {
          const existingAddress = await billAddressModel.findOne({ usercustomerRefNo })
          if (!existingAddress) {
            const newAddressArray = await billAddressModel.create(database)
            // console.log("billAddressModel", newAddressArray)

            return res.status(200).json({
              error: false,
              message: 'Successfully Registered',
              data: [newAddressArray],
            });
            
          }

          const newAddressArray = await billAddressModel.findOneAndUpdate(usercustomerRefNo, database)
          return res.status(200).json({
            error: false,
            message: 'Successfully Registered',
            data: [newAddressArray],
          });


        }

        // Respond with success and include the new address data
        return res.status(200).json({
          error: false,
          message: 'Successfully Registered',
          data: [result],
        });

      }


      else {

        //type = delievery address than save to delievery address database
        if (type === "D") {
          const newAddressArray = await addressModel.create(data2)
          console.log("addressModel", newAddressArray)

        }

        //type = billing address than save to billing address database
        else if (type === "B") {
          const existingAddress = await billAddressModel.findOne({ usercustomerRefNo })
          if (!existingAddress) {
            const newAddressArray = await billAddressModel.create(data2)
            console.log("billAddressModel", newAddressArray)

            return res.status(200).json({
              error: false,
              message: 'Successfully Registered',
              data: [newAddressArray],
            });

          }
          const newAddressArray = await billAddressModel.findOneAndUpdate(usercustomerRefNo, data2)
          return res.status(200).json({
            error: false,
            message: 'Successfully Registered',
            data: [newAddressArray],
          });

        }

        // Respond with success and include the new address data
        return res.status(200).json({
          error: false,
          message: 'Successfully Registered',
          data: [data2],
        });

      }

    }
    catch (err) {
      console.error('Error:', err);
      return res.status(500).json({
        error: true,
        message: err.message,
        data: null,
      });
    }


  }







  //getaddress
  async get_address(req, res) {
    const customerRefNo = req.user._id;

    console.log(customerRefNo);

    try {
      // Find the user by their ID
      const user = await addressModel.find({ "usercustomerRefNo": customerRefNo});
      console.log(user);

      if (user) {
        return res.json({
          error: false,
          message: 'User found successfully',
          data: user,
        });
      } else {
        return res.status(404).json({
          error: true,
          message: 'User not found',
          data: null,
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




  async updateAddress(req, res) {

    try {
      const customerRefNo = req.user._id;
      console.log('CustomerRefNum:', customerRefNo);

      const updateAddressData = req.body;
      console.log('Update Address Data:', updateAddressData);

      // Use findOneAndUpdate instead of findByIdAndUpdate to have more control
      const updatedAddress = await addressModel.findOneAndUpdate(
        { usercustomerRefNo: customerRefNo },
        updateAddressData,
        { new: true }
      );
      console.log(updatedAddress);

      if (!updatedAddress) {
        return res.status(404).json({
          error: true,
          message: 'User not found',
          data: null,
        });
      }

      // Log the updated address for debugging purposes
      console.log('Updated Address:', updatedAddress);

      // Make a cURL request to MMTC for updating address
      try {
        // Ensure that the data sent to MMTC is correct, modify the function parameters as needed
        const result1 = await userMMtc.addUpdateAddress(updateAddressData, res);

        // Check if the request was successful with MMTC or handle accordingly
        if (result1 && result1.success) {

          return res.json({
            error: false,
            message: 'User updated successfully',
            data: [result1],
          });
        } else {
          // Log the result for debugging purposes
          console.error('MMTC Request Result:', result1);

          // Handle the case when the MMTC request fails
          return res.status(500).json({
            error: true,
            message: 'MMTC request failed',
            data: null,
          });
        }
      } catch (err) {
        console.error('MMTC Error:', err);

        // Log the error for debugging purposes
        console.error('MMTC Request Error:', err);

        return res.status(500).json({
          error: true,
          message: 'MMTC Internal Server Error',
          data: null,
        });
      }
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({
        error: true,
        message: 'Internal Server Error',
        data: null,
      });
    }
  }


//delete address
  async deleteAddress(req, res) {
    try {
      const customerRefNo = req.user._id; // Assuming the ID of the address to delete is sent in the request body

      // Update the 'is_deleted' flag instead of physically deleting the data
      const result = await addressModel.findOneAndUpdate({ "usercustomerRefNo": customerRefNo }, { is_deleted: 1 }, { new: true });

      if (!result) {
        return res.status(404).json({
          error: true,
          message: 'Address not found',
          data: null,
        });
      }

      return res.status(200).json({
        error: false,
        message: 'Address marked as deleted',
        data: [result],
      });
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({
        error: true,
        message: error.message,
        data: null,
      });
    }
  }
}

module.exports = new AddressController();
