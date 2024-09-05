const express=require('express')
const user=express();


 const multer=require('multer')

const path=require('path')
const fs=require('fs')

const bodyParser=require('body-parser')

user.use(bodyParser.urlencoded({extended:true}))

user.use(express.json());

user.use(express.static(path.resolve(__dirname, 'public')));


var storage=multer.diskStorage
({
    destination:(req,file,cb)=>{
        cb(null,'./public/uploads')

    },
    filename:(req,file,cb)=>{
      cb(null,file.originalname)                
    }
});
var upload=multer({storage:storage})
const employeeController=require('../../controllers/customApi/employee.controller.js')

user.post('/importuser',upload.single('file'),employeeController.importUser)
// user.get('/userFind',employeeController.findData)
user.post('/login',employeeController.companyLogin)
user.get('/logout',employeeController.companyLogout)
user.get('/employeeTracker',employeeController.employeeTracker)
user.get('/tableData',employeeController.tableData)
user.get('/exportUser',employeeController.exportUser)
user.put('/updateEmployee',employeeController.updateEmployee)






// html rendering


// Set the views directory
const viewsDir = path.join(__dirname,"../", "../", 'views');


// login rendering

user.get('/renderLogin', (req, res) => {
  const filePath = path.join(viewsDir, "talentTracker", 'login.html');

  // Read the HTML file
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading HTML file:', err);
      return res.status(500).send('Internal Server Error');
    }
    // Send the HTML content
    res.send(data);
  });
});




// dashboard rendering

user.get('/renderDashboard', (req, res) => {
  const filePath = path.join(viewsDir, "talentTracker", 'dashboardNew.html');

  const sessionID = req.cookies.sessionID;

  // console.log("sessionID in dashboard", sessionID);

  if (!sessionID) {
    return res.status(400).json("unauthorized! Please login")
  }

  // Read the HTML file
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading HTML file:', err);
      return res.status(500).send('Internal Server Error');
    }
    // Send the HTML content
    res.send(data);
  });
});











// talent tracker rendering

user.get('/renderTalentTracker', (req, res) => {
  const sessionID = req.cookies.sessionID;

  // console.log("sessionID in tracker", sessionID);


  if (!sessionID) {
    return res.status(400).json("unauthorized! Please login")
  }

  const filePath = path.join(viewsDir, "talentTracker", 'employeeTracker.html');

  // Read the HTML file
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading HTML file:', err);
      return res.status(500).send('Internal Server Error');
    }
    // Send the HTML content
    res.send(data);
  });
});








// login rendering

user.get('/renderLoginIndex', (req, res) => {
  const filePath = path.join(viewsDir, "talentTracker", 'login.html');


  // Read the HTML file
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading HTML file:', err);
      return res.status(500).send('Internal Server Error');
    }
    // Send the HTML content
    res.send(data);
  });
});






/*********              data table                      ***************/

// login rendering

user.get('/renderLoginLatest', (req, res) => {
  const filePath = path.join(viewsDir, "talentTracker", 'loginLatest.html');

  // Read the HTML file
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading HTML file:', err);
      return res.status(500).send('Internal Server Error');
    }
    // Send the HTML content
    res.send(data);
  });
});



user.get('/renderDashboardLatest', (req, res) => {
  const filePath = path.join(viewsDir, "talentTracker", 'dashboardLatest.html');


  const sessionID = req.cookies.sessionID;

  // console.log("sessionID in dashboard", sessionID);

  if (!sessionID) {
    return res.status(400).json("unauthorized! Please login")
  }

  // Read the HTML file
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading HTML file:', err);
      return res.status(500).send('Internal Server Error');
    }
    // Send the HTML content
    res.send(data);
  });
});




module.exports=user;