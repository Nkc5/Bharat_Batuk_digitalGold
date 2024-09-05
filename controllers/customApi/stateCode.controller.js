const stateModel = require('../../models/state.models.js');
const countryModel = require('../../models/country.models.js');
const cityModel = require('../../models/city.models.js');
const path = require('path');
const fs = require('fs');
const validator = require('validator');


class StateCodeController {
  static stateCodesIndia = [
    { state_code: 35, iso_code: 'AN', name: 'Andaman and Nicobar Islands', status: 1, country_id: "657d5b3824cae0886de38353" },
    { state_code: 28, iso_code: 'AP', name: 'Andhra Pradesh', status: 1, country_id: "657d5b3824cae0886de38353" },
    { state_code: 12, iso_code: 'AR', name: 'Arunachal Pradesh', status: 1, country_id: "657d5b3824cae0886de38353" },
    { state_code: 18, iso_code: 'AS', name: 'Assam', status: 1, country_id: "657d5b3824cae0886de38353" },
    { state_code: 10, iso_code: 'BH', name: 'Bihar', status: 1, country_id: "657d5b3824cae0886de38353" },
    { state_code: 4, iso_code: 'CH', name: 'Chandigarh', status: 1, country_id: "657d5b3824cae0886de38353" },
    { state_code: 22, iso_code: 'CT', name: 'Chhattisgarh', status: 1, country_id: "657d5b3824cae0886de38353" },
    { state_code: 26, iso_code: 'DN', name: 'Dadra and Nagar Haveli', status: 1, country_id: "657d5b3824cae0886de38353" },
    { state_code: 25, iso_code: 'DD', name: 'Daman and Diu', status: 1, country_id: "657d5b3824cae0886de38353" },
    { state_code: 7, iso_code: 'DL', name: 'Delhi', status: 1, country_id: "657d5b3824cae0886de38353" },
    { state_code: 30, iso_code: 'GA', name: 'Goa', status: 1, country_id: "657d5b3824cae0886de38353" },
    { state_code: 24, iso_code: 'GJ', name: 'Gujarat', status: 1, country_id: "657d5b3824cae0886de38353" },
    { state_code: 6, iso_code: 'HR', name: 'Haryana', status: 1, country_id: "657d5b3824cae0886de38353" },
    { state_code: 2, iso_code: 'HP', name: 'Himachal Pradesh', status: 1, country_id: "657d5b3824cae0886de38353" },
    { state_code: 1, iso_code: 'JK', name: 'Jammu and Kashmir', status: 1, country_id: "657d5b3824cae0886de38353" },
    { state_code: 20, iso_code: 'JH', name: 'Jharkhand', status: 1, country_id: "657d5b3824cae0886de38353" },
    { state_code: 29, iso_code: 'KA', name: 'Karnataka', status: 1, country_id: "657d5b3824cae0886de38353" },
    { state_code: 32, iso_code: 'KL', name: 'Kerala', status: 1, country_id: "657d5b3824cae0886de38353" },
    { state_code: 31, iso_code: 'LD', name: 'Lakshadweep Island', status: 1, country_id: "657d5b3824cae0886de38353" },
    { state_code: 23, iso_code: 'MP', name: 'Madhya Pradesh', status: 1, country_id: "657d5b3824cae0886de38353" },
    { state_code: 27, iso_code: 'MH', name: 'Maharashtra', status: 1, country_id: "657d5b3824cae0886de38353" },
    { state_code: 14, iso_code: 'MN', name: 'Manipur', status: 1, country_id: "657d5b3824cae0886de38353" },
    { state_code: 17, iso_code: 'ME', name: 'Meghalaya', status: 1, country_id: "657d5b3824cae0886de38353" },
    { state_code: 15, iso_code: 'Ml', name: 'Mizoram', status: 1, country_id: "657d5b3824cae0886de38353" },
    { state_code: 13, iso_code: 'NL', name: 'Nagaland', status: 1, country_id: "657d5b3824cae0886de38353" },
    { state_code: 21, iso_code: 'OR', name: 'Odisha', status: 1, country_id: "657d5b3824cae0886de38353" },
    { state_code: 34, iso_code: 'PY', name: 'Puducherry', status: 1, country_id: "657d5b3824cae0886de38353" },
    { state_code: 3, iso_code: 'PB', name: 'Punjab', status: 1, country_id: "657d5b3824cae0886de38353" },
    { state_code: 8, iso_code: 'RJ', name: 'Rajasthan', status: 1, country_id: "657d5b3824cae0886de38353" },
    { state_code: 11, iso_code: 'SK', name: 'Sikkim', status: 1, country_id: "657d5b3824cae0886de38353" },
    { state_code: 33, iso_code: 'TN', name: 'Tamil Nadu', status: 1, country_id: "657d5b3824cae0886de38353" },
    { state_code: 36, iso_code: 'TS', name: 'Telangana', status: 1, country_id: "657d5b3824cae0886de38353" },
    { state_code: 16, iso_code: 'TR', name: 'Tripura', status: 1, country_id: "657d5b3824cae0886de38353" },
    { state_code: 9, iso_code: 'UP', name: 'Uttar Pradesh', status: 1, country_id: "657d5b3824cae0886de38353" },
    { state_code: 5, iso_code: 'UT', name: 'Uttarakhand', status: 1, country_id: "657d5b3824cae0886de38353" },
    { state_code: 19, iso_code: 'WB', name: 'West Bengal', status: 1, country_id: "657d5b3824cae0886de38353" },

  ];

  // static async insertStateCodes(req, res) {
  //   try {
  //     // Insert the state codes into the collection
  //     const result = await stateModel.insertMany(StateCodeController.stateCodesIndia);

  //     console.log(`${result.insertedCount} state codes inserted successfully.`);
  //     res.status(200).json({ message: `${result.insertedCount} state codes inserted successfully.` });
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).json({ error: 'Internal server error' });
  //   }
  // }


  static countryCode = {
    name: "Bharat",
    flag: `${path.resolve(__dirname, "../../views/Bharat.svg.webp")}`,
    iso_code: "IN",
    phone_code: "+91",
  }

  static async insertCountryCodes(req, res) {
    try {
      // Insert the state codes into the collection
      const result = await countryModel.create(StateCodeController.countryCode)
      console.log(result);
      res.status(200).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async insertstateCodes(req, res) {
    try {
      console.log("first")
      const country_id = await countryModel.findOne({ name: "Bharat" })._id;
      // Insert the state codes into the collection

      // console.log(country_id);

      const result = await stateModel.insertMany(StateCodeController.stateCodesIndia)


      // StateCodeController.stateCodesIndia.map(async (state) => {
      //   const result = await stateModel.create({ ...stat})
      // console.log(result);
      res.status(200).json(result);
      // })


      // const result = await stateModelModel.insertMany([StateCodeController.stateCodesIndia.map(state=>
      //   {state, country_id}  
      // )])
      // console.log(result);
      // res.status(200).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async insertcityCodes(req, res) {
    try {
      // Insert the state codes into the collection

      // const data = fs.readFileSync(path.resolve(__dirname, `../../views/city_list`), 'utf-8');
      const data = fs.readFileSync(path.resolve(__dirname, `../../views/city_updated.json`), 'utf-8');
      const jsonData = JSON.parse(data);
      const result = await cityModel.insertMany(jsonData);

      //  console.log(result);
      return res.status(200).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }




  static getstateCode = async (req, res) => {

    try {

      const state = await stateModel.find({})

      if (state) {
        return res.json({
          error: false,
          message: "Success",
          data: state

        })
      }

      else {
        return res.json({
          error: true,
          message: "States Not Found!",
          data: []

        })
      }
    }
    catch (error) {
      return res.json({
        error: true,
        message: error.message,
        data: []

      })
    }

  }

  static getcity = async (req, res) => {

    try {

      const city = await cityModel.find({})

      if (city) {
        return res.json({
          error: false,
          message: "Success",
          data: city
        })
      }

      else {
        return res.json({
          error: true,
          message: "Cities Not Found!",
          data: []

        })
      }

    }
    catch (error) {
      return res.json({
        error: true,
        message: error.message,
        data: []

      })
    }

  }

  static async getCitiesOfState(req, res) {
    const { _id } = req.body;

    if(typeof _id !== "string"){
      return res.json({
        error: true,
        message: "_id must be in string",
        data: []
      })
    }

    
    if(validator.isEmpty(_id)){
      return res.json({
        error: true,
        message: "_id should not be empty",
        data: []
      })
    }

    try {

      const cities = await cityModel.find({ state_id: _id })
    
      // console.log(cities)

      if(cities.length>0) {
        const newCities=  cities.map((city)=>{
          return city.city_name;
          })

          const state = await stateModel.findOne({_id});
          const stateName = state.name;
          
        return res.json({
          error: false,
          message: `${stateName} Cities Found, total:[${cities.length}]`,
          data: newCities
        })
      }

      else {
        return res.json({
          error: true,
          message: "Cities not found",
          data: []
        })
      }

    }


    catch (error) {
      console.log(error)
      return res.json({
        error: true,
        message: error.message,
        data: []
      })
    }


  }
}

module.exports = StateCodeController;
