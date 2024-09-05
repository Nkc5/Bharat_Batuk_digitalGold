
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./db');
const cors = require('cors')
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');



//connect to database
connectDB();



dotenv.config();
const PORT = process.env.PORT || 1337;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json())

app.use(cors());
// app.use(cors({ origin: '*' }));
app.use(cookieParser());


app.use(express.static(path.join(__dirname, "/public")))


const {user} = require('./routes/employee.router.js')


//middleware:  to clear cache in website
app.use((req, res, next) => {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    next();
  });
  
  
  // const isAuthenticated = (req, res, next) => {
  //   if (req.cookies.sessionID !=="") {
  //     return next();
  //   }
  //   // User is not authenticated, redirect to the login page
  //   res.redirect('/employee/renderLoginLatest');
  // };
  
  
  // employeeRouter
  app.use('/employee', user)



  
// login rendering

// const viewsDir = path.join(__dirname);

// app.get('/renderLoginLatest', (req, res) => {
//   const filePath = path.join(viewsDir,'loginLatest.html');

//   // Read the HTML file
//   fs.readFile(filePath, 'utf8', (err, data) => {
//     if (err) {
//       console.error('Error reading HTML file:', err);
//       return res.status(500).send('Internal Server Error');
//     }
//     // Send the HTML content
//     res.send(data);
//   });
// });

  

  










  


app.listen(PORT, console.log("server started at port:", PORT));


