


const csv = require('csvtojson');
const CsvParser = require('json2csv').Parser;
const DynamicModel = require('../../models/employee.models.js');
const validator = require('validator');
const { companyModel, loginModel } = require('../../models/companyLogin.models.js');
const { v4: uuidv4 } = require('uuid');





// fetching login details
async function companyLogin(req, res) {
  const sessionID = uuidv4();

  const { email, password } = req.body;

  if (!validator.isEmail(email)) {
    return res.status(400).json({
      error: true,
      message: "Email is not valid.",
      data: [null],
    });
  }
  var data = await loginModel.findOne({ $and: [{ email }, { password }] })

  // if(!data){
  //  const newUser= await loginModel.create( {email, password })
  // }
  var data2 = await companyModel.findOne({ _id: data.company_id })



  console.log("data", data)
  console.log("data2", data2)



  // if(newUser){
  //   res.cookie('login', newUser);
  //   return res.json("Login Successfully")
  // }
  if (data && data2) {

    // Setting a cookie
    res.cookie('login', data);
    res.cookie('company', data2);
    res.cookie("sessionID", sessionID);

    return res.json("Login Successfully")
  }

  else {
    return res.json({ error: "Wrong credentials" });
  }

}


async function companyLogout(req, res) {

  const sessionID = req.cookies.sessionID
  console.log("sessionID in logout", sessionID)

  if (sessionID != "") {
    res.cookie("sessionID", "");
  }

  console.log("sessionID in logout2", sessionID)


  return res.json("Logout succesfully")
}



const importUser = async (req, res) => {
  try {
    var csvData = await csv().fromFile(req.file.path);

    // console.log("csvData", csvData[2])

    if (!csvData.length) {
      return res.status(400).json({
        success: false,
        status: 400,
        msg: 'CSV file is empty.',
      });
    }



    const loginData = req.cookies.login;
    const company_id = loginData.company_id.toString();

    var userData = csvData.map((data) => {

      // Convert keys to lowercase/ replace space with _ & trim
      const newData = Object.fromEntries(
        Object.entries(data).map(([key, value]) => [key.toLowerCase().replace(/\s+/g, '_').trim(), value])
      );

      // Add company_id to each object
      newData.company_id = company_id;



      return newData;
    });


    // console.log("userData", userData)
    var response = await DynamicModel.insertMany(userData);

    // console.log("response", response)


    // Send response
    res.json({
      success: true,
      status: 200,
      msg: 'CSV Imported',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      status: 400,
      msg: error.message,
    });
  }
};








// find query
async function tableData(req, res) {
  try {


    // Retrieving the cookie
    const loginData = req.cookies.login;

    // Now you can access properties of the 'login' cookie
    const company_id = loginData.company_id.toString();

    console.log("company_id", company_id)

    // Assuming division_head_id is a field in the dynamic schema
    // const User = createDynamicModel('dynamic_users', ['']);

    var user = await DynamicModel.find({ company_id: company_id });

    // console.log("tableData", user)

    // console.log(user);

    res.setHeader('Content-Type', 'application/json');
    return res.json(user);


  } catch (error) {
    res.status(400).json({
      success: false,
      status: 400,
      msg: error.message,
    });
  }
}


// fetching login details
async function employeeTracker(req, res) {


  const employeeId = req.query.employeeId;
  console.log("req.query", employeeId)

  // Retrieving the cookie
  const loginData = req.cookies.login;

  // Now you can access properties of the 'login' cookie
  const company_id = loginData.company_id.toString();

  try {

    //find by employee name
    const user = await DynamicModel.findOne({ $and: [{ external_id: employeeId }, { company_id }] });

    // console.log(user);

    return res.json(user);

  } catch (error) {
    res.status(400).json({
      success: false,
      status: 400,
      msg: error.message,
    });
  }

}


const updateEmployee = async (req, res) => {


  // Retrieving the cookie
  const loginData = req.cookies.login;
  const employeeId = req.query.employeeId;
  const company_id = loginData.company_id.toString();

  const data = req.body;

  try {


    // Fetch the inserted documents with lean() to remove Mongoose-specific metadata
    const users = await DynamicModel.findOneAndUpdate({$and: [{company_id}, { external_id: employeeId} ]}, data, {new:true})

    // If no users found, return an empty response
    if (!users) {
      return res.status(400).json({
        success: false,
        status: 400,
        msg: 'Failed to update',
      });
    }

    // Send CSV data in the response
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({
      success: false,
      status: 500,
      msg: err.message,
    });
  }
};






const exportUser = async (req, res) => {


  // Retrieving the cookie
  const loginData = req.cookies.login;
  const companyData = req.cookies.company;
  const companyName = companyData.name.split(' ')
  const name = companyName[0] + "_" + companyName[1]

  console.log("loginData", loginData)
  console.log("companyData", companyData)

  // Now you can access properties of the 'login' cookie
  const company_id = loginData.company_id.toString();

  try {


    // Fetch the inserted documents with lean() to remove Mongoose-specific metadata
    const users = await DynamicModel.find({ company_id }).select('-_id -__v').lean();


    // Remove the custom property from each document
    const modifiedData = users.map((document) => {
      // Create a new object without the custom property
      const { company_id: omit, ...newDocument } = document;
      return newDocument;
    });


    // If no users found, return an empty response
    if (!users.length) {
      return res.status(404).json({
        success: false,
        status: 404,
        msg: 'No user data found in the database.',
      });
    }

    // Prepare CSV data
    const csvFields = ['dynamic_users'];
    const csvParser = new CsvParser({ csvFields });
    const csvData = csvParser.parse(modifiedData);

    // Set response headers for CSV file download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=${name}.csv`);

    // Send CSV data in the response
    res.status(200).end(csvData);
  } catch (err) {
    res.status(500).json({
      success: false,
      status: 500,
      msg: err.message,
    });
  }
};



module.exports = {
  importUser,
  companyLogin,
  companyLogout,
  employeeTracker,
  tableData,
  exportUser,
  updateEmployee
};
