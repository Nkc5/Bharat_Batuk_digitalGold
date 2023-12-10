

const nomineeModel = require('../../models/nominee.model.js');
const validator = require('validator');
const mongoose=require('mongoose')
class NomineeController {
  constructor() {
     this.customer_ref = '';
  }

  // Add nominee
  async addNominee(req, res) {
    try {
      const {customer_ref, name, phone, email, relation } = req.body;
      let errors = "";
       if(!customer_ref){
        errors +='customer ref is required'
       }
      // Check each field and accumulate error messages
      if (!name) {
        errors += "Please enter your name. ";
      }
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
          data: [null],
        });
      }

      const user = await nomineeModel.create({
        customer_ref,
        name,
        phone,
        email,
        relation,
      });
console.log('user',user);

      return res.json({
        error: false,
        message: 'Nominee added successfully',
        data: [user],
      });
    } catch (err) {
      console.error(err);
      return res.status(400).json({
        error: true,
        message: 'Unsuccessful',
        data: null,
      });
    }
  }

  // Update nominee
  async updateNominee(req, res) {
    try {
      const data = req.body;
      // this.customer_ref = req.user._doc._id;

      const updatedNominee = await nomineeModel.findOneAndUpdate({ customer_ref: this.customer_ref  }, data, { new: true });
       console.log(updatedNominee)
      if (!updatedNominee) {
        return res.status(404).json({
          error: true,
          message: "Nominee not found",
          data: null,
        });
      }

      return res.status(200).json({
        error: false,
        message: "Nominee updated successfully",
        data: [updatedNominee],
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        error: true,
        message: "Internal server error",
        data: null,
      });
    }
  }

  // List nominee
async listNominee(req, res) {
  try {
    // this.customer_ref = req.user._doc._id;

    const user = await nomineeModel.findOne({ customer_ref: this.customer_ref });
    if (user) {
      return res.status(200).json({
        error: false,
        message: 'Nominee found successfully',
        data: [user],
      });
    } else {
      return res.status(400).json({
        error: true,
        message: 'No such user found',
        data: null,
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(400).json({
      error: true,
      message: 'Unsuccessful',
      data: null,
    });
  }
/*

const userId = req.params.id;
  
   try {
      // Check if userId is a valid ObjectId before attempting to query the database
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({
          error: true,
          message: 'Invalid user ID format',
          data: null,
        });
      }

      // Find the user by their ID
      const user = await nomineeModel.findById(userId);

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
    }*/
}
}
module.exports = NomineeController;

/*class NomineeController {
constructor() {
     //this.customer_ref = '';
  }

  // Add nominee
  async addNominee(req, res) {
    try {
      const { customer_ref, name, phone, email, relation } = req.body;
      let errors = "";
       // Check each field and accumulate error messages
      if (!customer_ref) {
        errors += "Please enter your customer_ref. ";
      }

      // Check each field and accumulate error messages
      if (!name) {
        errors += "Please enter your city. ";
      }
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
          data: [null],
        });
      }

      const user = await nomineeModel.create({
        customer_ref,
        name,
        phone,
        email,
        relation,
      });

      return res(200).json({
        error: false,
        message: 'Nominee added successfully',
        data: [user],
      });
    } catch (err) {
      console.error(err);
      return res.status(400).json({
        error: true,
        message: 'Unsuccessful',
        data: null,
      });
    }
  }

  // Update nominee
  async updateNominee(req, res) {
    try {
      const data = req.body;
       //this.customer_ref = req.user._doc._id;

      const updatedNominee = await nomineeModel.findOneAndUpdate({ customer_ref }, data, { new: true });

      if (!updatedNominee) {
        return res.status(404).json({
          error: true,
          message: "Nominee not found",
          data: null,
        });
      }

      return res.status(200).json({
        error: false,
        message: "Nominee updated successfully",
        data: [updatedNominee],
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        error: true,
        message: "Internal server error",
        data: null,
      });
    }
  }

  // List nominee
async listNominee(req, res) {
    try {
     // this.customer_ref = req.user._doc._id;

      const user = await nomineeModel.findOne({ customer_ref });
      if (user) {
        return res.status(200).json({
          error: false,
          message: 'Nominee found successfully',
          data: [user],
        });
      } else {
        return res.status(400).json({
          error: true,
          message: 'No such user found',
          data: null,
        });
      }
    } catch (err) {
      console.error(err);
      return res.status(400).json({
        error: true,
        message: 'Unsuccessful',
        data: null,
      });
    }
  }
}

module.exports = NomineeController;*/
/*
const mongoose=require('mongoose');

const nomineeModel = require('../../models/nominee.model.js');
const validator = require('validator');

class NomineeController {
constructor() {
    // this.customer_ref = '';
  }

  async addNominee(req, res) {
    try {
      const { customer_ref, name, phone, email, relation } = req.body;
      let errors = "";

      // Check each field and accumulate error messages
      if (!customer_ref) {
        errors += "Please enter your customer_ref. ";
      }

      if (!phone || !/^\d{10}$/.test(phone)) {
        // Check if mobileNumber is not 10 digits
        errors += "Mobile number must be 10 digits. ";
      }

      if (!validator.isEmail(email)) {
        errors += "Email is not valid. ";
      }

      if (!relation) {
        errors += "Please enter your relation. ";
      }

      // Trim to remove trailing space
      errors = errors.trim();

      // Check if there are any errors
      if (errors !== "") {
        return res.status(400).json({
          error: true,
          message: errors,
          data: [null],
        });
      }

      const user = await nomineeModel.create({
        customer_ref,
        name,
        phone,
        email,
        relation,
      });

      return res.json({
        error: false,
        message: 'Nominee added successfully',
        data: [user],
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        error: true,
        message: 'Internal server error',
        data: [null],
      });
    }
  }
  // Update nominee
  async updateNominee(req, res) {
    try {
      // Check if user is authenticated and has _doc property
      if (!req.user || !req.user._doc || !req.user._doc._id) {
        return res.status(401).json({
          error: true,
          message: 'Unauthorized user',
          data: [null],
        });
      }

      const data = req.body;
      const customer_ref = req.user._doc._id;

      const updatedNominee = await nomineeModel.findOneAndUpdate(
        { customer_ref: customer_ref },
        data,
        { new: true }
      );

      if (!updatedNominee) {
        return res.status(404).json({
          error: true,
          message: "Nominee not found",
          data: [null],
        });
      }

      return res.status(200).json({
        error: false,
        message: "Nominee updated successfully",
        data: [updatedNominee],
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        error: true,
        message: 'Internal server error',
        data: [null],
      });
    }
  }

  // List nominee
  async listNominee(req, res) {
    try {
      // Check if user is authenticated and has _doc property
      if (!req.user || !req.user._doc || !req.user._doc._id) {
        return res.status(401).json({
          error: true,
          message: 'Unauthorized user',
          data: [null],
        });
      }

      const customer_ref = req.user._doc._id;

      const user = await nomineeModel.findOne({ customer_ref });
      if (user) {
        return res.status(200).json({
          error: false,
          message: 'Nominee found successfully',
          data: [user],
        });
      } else {
        return res.status(404).json({
          error: true,
          message: 'No such user found',
          data: [null],
        });
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        error: true,
        message: 'Internal server error',
        data: [null],
      });
    }
  }}

module.exports = NomineeController;

*/
/*
const nomineeModel = require('../../models/nominee.model.js');
const validator = require('validator');

class NomineeController {
  constructor() {
   // this.customer_ref = '';
  }

  // Add nominee
  async addNominee(req, res) {
    try {
      const { name, phone, email, relation } = req.body;

      // Check each field and accumulate error messages
      if (!name) {
        return res.status(400).json({
          error: true,
          message: "Please enter your city.",
          data: [null],
        });
      }

      if (!validator.isEmail(email)) {
        return res.status(400).json({
          error: true,
          message: "Email is not valid.",
          data: [null],
        });
      }

      if (!phone || !/^\d{10}$/.test(phone)) {
        return res.status(400).json({
          error: true,
          message: "Mobile number must be 10 digits.",
          data: [null],
        });
      }

      if (!relation) {
        return res.status(400).json({
          error: true,
          message: "Please Enter Your Relation.",
          data: [null],
        });
      }

      // Check if user is authenticated and has _doc property
      if (!req.user || !req.user._doc || !req.user._doc._id) {
        return res.status(401).json({
          error: true,
          message: 'Unauthorized user',
          data: [null],
        });
      }

      this.customer_ref = req.user._doc._id;

      const user = await nomineeModel.create({
       customer_ref: this.customer_ref,
        name,
        phone,
        email,
        relation,
      });

      return res.json({
        error: false,
        message: 'Nominee added successfully',
        data: [user],
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        error: true,
        message: 'Internal server error',
        data: [null],
      });
    }
  }

  // Update nominee
  async updateNominee(req, res) {
    try {
      // Check if user is authenticated and has _doc property
      if (!req.user || !req.user._doc || !req.user._doc._id) {
        return res.status(401).json({
          error: true,
          message: 'Unauthorized user',
          data: [null],
        });
      }

      const data = req.body;
      this.customer_ref = req.user._doc._id;

      const updatedNominee = await nomineeModel.findOneAndUpdate(
        { customer_ref: this.customer_ref },
        data,
        { new: true }
      );

      if (!updatedNominee) {
        return res.status(404).json({
          error: true,
          message: "Nominee not found",
          data: [null],
        });
      }

      return res.status(200).json({
        error: false,
        message: "Nominee updated successfully",
        data: [updatedNominee],
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        error: true,
        message: 'Internal server error',
        data: [null],
      });
    }
  }

  // List nominee
  async listNominee(req, res) {
    try {
      // Check if user is authenticated and has _doc property
      if (!req.user || !req.user._doc || !req.user._doc._id) {
        return res.status(401).json({
          error: true,
          message: 'Unauthorized user',
          data: [null],
        });
      }

      this.customer_ref = req.user._doc._id;

      const user = await nomineeModel.findOne({ customer_ref: this.customer_ref });
      if (user) {
        return res.status(200).json({
          error: false,
          message: 'Nominee found successfully',
          data: [user],
        });
      } else {
        return res.status(404).json({
          error: true,
          message: 'No such user found',
          data: [null],
        });
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        error: true,
        message: 'Internal server error',
        data: [null],
      });
    }
  }
}

module.exports = NomineeController;
*/