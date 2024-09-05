

const addressModel = require('../../models/address.models.js');
const logAction = require('./logAction.controller.js');
const userModel = require('../../models/user.models.js');
// const mongoose = require('mongoose');
const userMMtc = require('../mmtcApi/user.controller')
const adharModel = require('../../models/adhar.models.js');



// let city, country, customerRefNo, line1, mobileNumber, name, state, statecode, type, zip, line2;


class AddressController {

  constructor() {


  }


  //   async addAddress(req, res) {

  //     const {
  //       city,
  //       country,
  //       line1,
  //       state,
  //       statecode,
  //       type,
  //       zip,
  //       line2,
  //       name,
  //       mobileNumber
  //     } = req.body;

  //     if (typeof city !== "string") {
  //       return res.status(400).json({
  //           "error": true,
  //           "message": "city must be string",
  //           "data": null
  //       })
  //   }

  //   if (typeof country !== "string") {
  //     return res.status(400).json({
  //         "error": true,
  //         "message": "country must be string",
  //         "data": null
  //     })
  // }
  // if (typeof line1 !== "string") {
  //   return res.status(400).json({
  //       "error": true,
  //       "message": "line1 must be string",
  //       "data": null
  //   })
  // }
  // if (typeof zip !== "number") {
  //   return res.status(400).json({
  //       "error": true,
  //       "message": "zip must be number",
  //       "data": null
  //   })
  // }
  // if (typeof state !== "string") {
  //   return res.status(400).json({
  //       "error": true,
  //       "message": "state must be string",
  //       "data": null
  //   })
  // }
  // if (typeof statecode !== "string") {
  //   return res.status(400).json({
  //       "error": true,
  //       "message": "statecode must be strin",
  //       "data": null
  //   })
  // }
  // if (typeof type !== "string") {
  //   return res.status(400).json({
  //       "error": true,
  //       "message": "type must be string",
  //       "data": null
  //   })
  // }
  // if (typeof name !== "string") {
  //   return res.status(400).json({
  //       "error": true,
  //       "message": "name must be string",
  //       "data": null
  //   })
  // }
  // if (typeof mobileNumber !== "string") {
  //   return res.status(400).json({
  //       "error": true,
  //       "message": "mobileNumber must be string",
  //       "data": null
  //   })
  // }

  //     let errors = "";

  //     // Check each field and accumulate error messages
  //     if (!city) {
  //       errors = "Please enter your city. ";
  //     }
  //     else if (!country) {
  //       errors = "Please enter your country. ";
  //     }



  //     else if (!state) {
  //       errors = "Please enter your state. ";
  //     }
  //     else if (!statecode) {
  //       errors = "Please enter your statecode. ";
  //     }
  //     else if (!type) {
  //       errors = "Please enter your type. ";
  //     }
  //     else if (!zip) {
  //       errors = "Please enter your zip. ";
  //     }
  //     else if (!line2) {
  //       errors = "Please enter your line2. ";
  //     }




  //     // Check if there are any errors
  //     if (errors !== "") {
  //       return res.status(400).json({
  //         error: true,
  //         message: errors,
  //         data: [],
  //       });
  //     }

  //     // type "D" or "B" check
  //     if (type !== "D" && type !== "B") {
  //       return res.status(400).json({
  //         error: true,
  //         message: "type is invalid",
  //         data: [],
  //       });
  //     }

  //     const customerRefNo = req.user._id.toString();
  //     const data = { ...req.body, customerRefNo }
  //     try {

  //       if (type === "B") {
  //         const existingAdd = await addressModel.findOne({ $and: [{ customerRefNo },{type: "B"}, { is_deleted: 0 }] });
  //         if (existingAdd) {
  //           return res.status(400).json({
  //             error: true,
  //             message: "Billing Address already exist, Please update",
  //             data: [],
  //           });
  //         }

  //       }


  //       const responseDB = await addressModel.create(data);



  //       // logger
  //       const logResponse = await logAction.log("add address", null, responseDB);
  //      console.log(logResponse);




  //       return res.status(200).json({
  //         error: false,
  //         message: ' Address Registered Successfully',
  //         data: [responseDB],
  //       });
  //     }

  //     catch (error) {
  //       console.log(error)
  //       return res.json({
  //         "error": true,
  //         "message": error,
  //         "data": [],
  //       })
  //     }


  //   }


  //addAddressUpdaet

  // let city, country, customerRefNo, line1, mobileNumber, name, state, statecode, type, zip, line2;
  async addAddress(req, res) {

    var {
      city,
      country,
      line1,
      state,
      statecode,
      type,
      zip,
      line2,
      name,
      mobileNumber
    } = req.body;


    zip = Number(zip);

    if (typeof city !== "string") {
      return res.status(400).json({
        "error": true,
        "message": "city must be string",
        "data": []
      })
    }

    if (typeof country !== "string") {
      return res.status(400).json({
        "error": true,
        "message": "country must be string",
        "data": []
      })
    }
    if (typeof line1 !== "string") {
      return res.status(400).json({
        "error": true,
        "message": "line1 must be string",
        "data": []
      })
    }
    if (typeof zip !== "number") {
      console.log(typeof zip)
      console.log("Zip must be number")



      return res.status(400).json({
        error: true,
        message: "Zip must be a number",
        data: []
      });
    } else if (!/^\d{6}$/.test(zip)) {
      console.log("Zip must be six digits")
      return res.status(400).json({
        error: true,
        message: "Zip must be six digits",
        data: []
      });
    }
    if (typeof state !== "string") {
      return res.status(400).json({
        "error": true,
        "message": "state must be string",
        "data": []
      })
    }
    if (typeof statecode !== "string") {
      return res.status(400).json({
        "error": true,
        "message": "statecode must be string",
        "data": []
      })
    }
    if (typeof type !== "string") {
      return res.status(400).json({
        "error": true,
        "message": "type must be string",
        "data": []
      })
    }
    if (typeof name !== "string") {
      return res.status(400).json({
        "error": true,
        "message": "name must be string",
        "data": []
      })
    }
    if (typeof mobileNumber !== "string") {
      return res.status(400).json({
        "error": true,
        "message": "mobileNumber must be a string",
        "data": []
      });
    } else if (mobileNumber.length !== 10 || isNaN(mobileNumber)) {
      return res.status(400).json({
        "error": true,
        "message": "mobileNumber must be a 10-digit",
        "data": []
      });
    }


    console.log("after check")
    // let errors = "";

    // // Check each field and accumulate error messages
    // if (!city) {
    //   errors += "Please enter your city. ";
    // }
    // else if (!country) {
    //   errors += "Please enter your country. ";
    // }

    // else if (!line1) {
    //   errors += "Please enter your line1. ";
    // }

    // else if (!state) {
    //   errors += "Please enter your state. ";
    // }
    // else if (!statecode) {
    //   errors += "Please enter your statecode. ";
    // }
    // else if (!type) {
    //   errors += "Please enter your type. ";
    // }
    // else if (!zip) {
    //   errors += "Please enter your zip. ";
    // }
    // else if (!line2) {
    //   errors += "Please enter your line2. ";
    // }




    // // Check if there are any errors
    // if (errors !== "") {
    //   return res.status(400).json({
    //     error: true,
    //     message: errors,
    //     data: [],
    //   });
    // }

    // type "D" or "B" check
    if (type !== "D" && type !== "B") {
      return res.status(400).json({
        error: true,
        message: "type is invalid",
        data: [],
      });
    }

    const customerRefNo = req.user._id.toString();
    const data = { ...req.body, customerRefNo }
    try {

      if (type === "B") {
        const existingAdd = await addressModel.findOne({ $and: [{ customerRefNo }, { type: "B" }, { is_deleted: 0 }] });
        if (existingAdd) {
          return res.status(400).json({
            error: true,
            message: "Billing Address already exist, Please update",
            data: [],
          });
        }

      }


      var responseDB = await addressModel.create(data);

      var user = await userModel.findOne({ _id: customerRefNo });

      if(!user.city && !user.state && type==="B"){
        user.city = responseDB.city
        user.state = responseDB.state
        await user.save();
      }



      console.log("mmtc", user.mmtc_customer_ref);

      if (type === "D" && user.mmtc_customer_ref) {

        try {

        var result = await userMMtc.addUpdateAddress({ city, country, line1, line2, mobileNumber, name, statecode, state, type, zip, customerRefNo }, res);
        var address = await addressModel.findOne({ _id: responseDB._id});
        address.id = result.id;
        address.mmtc_customer_ref = result.customerRefNo;
        await address.save();
        console.log("mmtc response", result)

      } catch (error) {
        console.log(error)
        const errorMessage = JSON.parse(error.message);
        const errorReason = errorMessage.reason;
        const errorCode = errorMessage.code;

        return res.json({
            "error": true,
            "message": errorReason,
            "data": [],
            "code": errorCode
        })
      }

      }

      console.log("responseDB", responseDB)

      // logger
      const logResponse = await logAction.log("add address", null, responseDB);
      console.log(logResponse);




      return res.status(200).json({
        error: false,
        message: ' Address Registered Successfully',
        data: [address? address:responseDB],
      });
    }

    catch (error) {
      console.log(error)

      return res.json({
        "error": true,
        "message": error,
        "data": [],
      })
    }


  }





  async get_address(req, res) {
    const customerRefNo = req.user._id.toString();
    const userDB = await userModel.findOne({_id: customerRefNo});

    try {


      // Find the user by their ID, excluding deleted addresses
      const user = await addressModel.find({ customerRefNo, is_deleted: { $ne: 1 } });
      //console.log(user);

      if (user && user.length > 0) {
        
        if(userDB.mmtc_customer_ref){
          try{
            var response = await userMMtc.getAddresses({customerRefNo}, res);

            console.log("mmtc address response", response);
          }
          catch(error){
            console.log(error)
            const errorMessage = JSON.parse(error.message);
            const errorReason = errorMessage.reason;
            const errorCode = errorMessage.code;
    
            return res.json({
                "error": true,
                "message": errorReason,
                "data": [],
                "code": errorCode
            })
          }
        }
        return res.json({
          error: false,
          message: 'Address found successfully',
          data: user,
        });
      } else {
        return res.status(400).json({
          error: true,
          message: 'No active addresses found',
          data: [],
        });
      }
    } catch (error) {

      return res.json({
        "error": true,
        "message": error,
        "data": [],

      });

    }
  }







  //update address 
  async updateAddress(req, res) {

    const crn = req.user._id.toString();
    // const { _id, type, ...restData } = req.body;


    var { _id, type, city,
      country,
      line1,
      state,
      statecode,
      zip,
      line2,
      name,
      mobileNumber } = req.body;


    zip = Number(zip);

    if (typeof city !== "string") {
      return res.status(400).json({
        "error": true,
        "message": "city must be string",
        "data": []
      })
    }

    if (typeof country !== "string") {
      return res.status(400).json({
        "error": true,
        "message": "country must be string",
        "data": []
      })
    }
    if (typeof line1 !== "string") {
      return res.status(400).json({
        "error": true,
        "message": "line1 must be string",
        "data": []
      })
    }
    if (typeof zip !== "number") {
      return res.status(400).json({
        error: true,
        message: "Zip must be a number",
        data: []
      });
    } else if (!/^\d{6}$/.test(zip)) {
      return res.status(400).json({
        error: true,
        message: "Zip must be six digits",
        data: []
      });
    }
    if (typeof state !== "string") {
      return res.status(400).json({
        "error": true,
        "message": "state must be string",
        "data": []
      })
    }
    if (typeof statecode !== "string") {
      return res.status(400).json({
        "error": true,
        "message": "statecode must be string",
        "data": []
      })
    }
    if (typeof type !== "string") {
      return res.status(400).json({
        "error": true,
        "message": "type must be string",
        "data": []
      })
    }
    if (typeof name !== "string") {
      return res.status(400).json({
        "error": true,
        "message": "name must be string",
        "data": []
      })
    }
    if (typeof mobileNumber !== "string") {
      return res.status(400).json({
        "error": true,
        "message": "mobileNumber must be a string",
        "data": []
      });
    } else if (mobileNumber.length !== 10 || isNaN(mobileNumber)) {
      return res.status(400).json({
        "error": true,
        "message": "mobileNumber must be a 10-digit",
        "data": []
      });
    }


    if (_id == undefined || _id === null) {
      return res.status(400).json({
        error: true,
        message: 'No "_id" found',
        data: [],
      });
    }

    // Make a cURL request to MMTC for updating address
    try {

      const mmtcCustRef = req.user.mmtc_customer_ref;

      if (mmtcCustRef && type === "B") {  // in mmtc address update "id" also changed

        // console.log("...restData, customerRefNo", { ...restData, "customerRefNo": crn });
        const result = await userMMtc.addUpdateAddress({
          type, city,
          country,
          line1,
          state,
          statecode,
          zip,
          line2,
          name,
          mobileNumber, "customerRefNo": crn
        }, res);

        // delete customerRefNo from result
        delete result.customerRefNo;
        console.log("result", result);

        // oldDocument
        const oldDocument = await addressModel.findOne({ $and: [{ customerRefNo: crn }, { _id }] });

        const responseDB = await addressModel.findOneAndUpdate({ $and: [{ customerRefNo: crn }, { _id }] }, result, { new: true })


        // logger
        await logAction.log("update address", oldDocument, responseDB);


        return res.status(200).json({
          error: false,
          message: 'Address Updated Successfully',
          data: [responseDB],
        });

      }

      else {

        // oldDocument
        const oldDocument = await addressModel.findOne({ $and: [{ customerRefNo: crn }, { _id }] });

        const responseDB = await addressModel.findOneAndUpdate({ $and: [{ customerRefNo: crn }, { _id }] }, {
          type, city,
          country,
          line1,
          state,
          statecode,
          zip,
          line2,
          name,
          mobileNumber
        }, { new: true })

        // logger
        await logAction.log("update address", oldDocument, responseDB);


        console.log(responseDB);

        return res.status(200).json({
          error: false,
          message: 'Address Updated Successfully',
          data: [responseDB],
        });
      }
    }

    catch (error) {
      console.log(error)
      const errorMessage = JSON.parse(error.message);
      const errorReason = errorMessage.reason;
      const errorCode = errorMessage.code;

      return res.json({
        "error": true,
        "message": errorReason,
        "data": [],
        "code": errorCode
      })
    }
  }



  async deleteAddress(req, res) {
    try {
      const customerRefNo = req.user._id;
      const mmtcCustRef = req.user.mmtc_customer_ref;

      const { _id } = req.body;


      if (_id == undefined || _id === null) {
        return res.status(400).json({
          error: true,
          message: 'No _id found',
          data: [],
        });
      }


      // oldDocument
      const oldDocument = await addressModel.findOne({ _id });

      if (oldDocument === null || oldDocument === undefined || !oldDocument) {
        return res.status(400).json({
          error: true,
          message: 'no address found!',
          data: [],
        });
      }

      // Update the 'is_deleted' flag instead of physically deleting the data
      const addressDB = await addressModel.findOneAndUpdate({ _id }, { is_deleted: 1 }, { new: true });

      // logger
      await logAction.log("delete address", oldDocument, addressDB);

      return res.status(200).json({
        error: false,
        message: 'Address mark as deleted',
        data: [addressDB],
      });
    } catch (error) {
      console.log(error);
      const errorMessage = JSON.parse(error.message);
      const errorReason = errorMessage.reason;
      const errorCode = errorMessage.code;

      return res.json({
        error: true,
        message: errorReason,
        data: [],
        code: errorCode,
      });
    }
  }
}

module.exports = new AddressController();
