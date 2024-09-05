
const express = require('express');
const dotenv = require('dotenv');
const { connectDB } = require('./db');
const cors = require('cors')
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');
var session = require('express-session')
const cron = require('node-cron');




//connect to database
connectDB();




const { restrictToLoggedInUserOnly } = require('./middlewares/auth.middleware.js')

const liquiloan = require('./routes/p2pRoutes/isInvestorexistRouter.js')
const customeTradeRoute = require('./routes/customRoutes/customTrade.router.js');
const resisterUserRoute = require('./routes/customRoutes/security.router.js');
const addressRouter = require('./routes/customRoutes/address.router.js');
const nomineeRouter = require('./routes/customRoutes/nominee.router.js');
const preferenceRouter = require('./routes/customRoutes/preference.router.js');
const priceRouter = require('./routes/customRoutes/price.router.js');
const activeRouter = require('./routes/customRoutes/active.router.js')
const panRouter = require('./routes/customRoutes/verifyPan.router.js')
const logoutRouter = require('./routes/customRoutes/logout.router.js')
const userUpdateRouter = require('./routes/customRoutes/userUpdate.router.js')
const updateFCMrouter = require('./routes/customRoutes/updateFCM.router.js');
const stateCode = require('./routes/customRoutes/stateCode.router.js')
const nodeMailerRouter = require('./routes/customRoutes/nodemailer.router.js')
const getUserDetailsRouter = require('./routes/customRoutes/getUserDetails.router.js')
const paymentRouter = require('./routes/customRoutes/payment.router.js')
const employeeRouter = require('./routes/customRoutes/employee.router.js')
const uploadRoutes = require('./routes/customRoutes/multer.router.js')
const userImage = require('./routes/customRoutes/userImage.router.js')
const kycImage = require('./routes/customRoutes/kyc.router.js')
const adharImage = require('./routes/customRoutes/adhar.router.js')
const adharBackImage = require('./routes/customRoutes/adharBack.router.js')
const redeemRouter = require('./routes/customRoutes/redeem.router.js')
const p2pRouter = require('./routes/customRoutes/p2p.router.js')
const language = require('./routes/customRoutes/language.router.js')
const product = require('./routes/augmontRoutes/product.router.js')
const goldRates = require('./routes/augmontRoutes/gold-silver-rates.router.js')
const getPassbook = require('./routes/augmontRoutes/passbook.router.js')
const bankaccount = require('./routes/augmontRoutes/create_bank.router.js')
const bankList = require('./routes/augmontRoutes/bankList.router.js')
// const OrderList = require('./routes/augmontRoutes/orderList.router.js')
const redeemPostOrder = require('./routes/augmontRoutes/postOrder.router.js')
const orderInfo = require('./routes/augmontRoutes/getOrderInfo.router.js')
const augmontRouter = require('./routes/augmontRoutes/augmont_routes.js')
// const statelist = require('./routes/augmontRoutes/state-list.router.js')
// const finzyRouter=require('./routes/finzeeRoutes/finzyRoutes.js')
const setHeaders = require('./middlewares/set-headers.js');




dotenv.config();
const PORT = process.env.PORT || 1337;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(express.static('public'))

app.use(cors());

app.use(cookieParser());



//set headers

app.use(setHeaders);

//sessions 

// app.use(session({
//   secret: process.env.secret_key, // This should be a secret key used to sign the session ID cookie
//   resave: false,
//   saveUninitialized: true,
//   cookie: { secure: false }, // Set secure: true if your site is served over HTTPS
// }));




// Set EJS as the view engine
app.set('view engine', 'ejs');

// Specify the directory where your views are located (optional)
app.set('views', __dirname + '/views');


//p2p
app.use('/p2p', p2pRouter)





/*    Custom API      */

//custom
app.use('/customUser', resisterUserRoute)

app.use('/customTrade', restrictToLoggedInUserOnly, customeTradeRoute)

// redeem
app.use('/redeem', restrictToLoggedInUserOnly, redeemRouter)

app.use('/address', restrictToLoggedInUserOnly, addressRouter)
app.use('/nominee', restrictToLoggedInUserOnly, nomineeRouter)
app.use('/preference', restrictToLoggedInUserOnly, preferenceRouter)
app.use('/pan', restrictToLoggedInUserOnly, panRouter)

// price
app.use('/price', priceRouter);
app.use('/act', restrictToLoggedInUserOnly, activeRouter);


// get profile
app.use('/getProfile', restrictToLoggedInUserOnly, getUserDetailsRouter)

//update user
app.use('/users', restrictToLoggedInUserOnly, userUpdateRouter)


//update FCM
app.use('/updateFCM', restrictToLoggedInUserOnly, updateFCMrouter)

//stateCode
app.use('/stateCode', stateCode)
app.use('/language', restrictToLoggedInUserOnly, language)
//payment gateway
// app.use('/onepay', paymentRouter)

app.use('/onepayresponse', paymentRouter)

//nodeMailer
app.use('/nodeMailer', nodeMailerRouter)


//logout
app.use('/logout', restrictToLoggedInUserOnly, logoutRouter)
app.use('/liquiloan', restrictToLoggedInUserOnly, liquiloan);

//talent tracker
// app.use('/talent', talentRouter);



// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Use the file upload routes
app.use('/upload', uploadRoutes);


//userImage
app.use('/userImage', restrictToLoggedInUserOnly, userImage)
app.use('/kyc', restrictToLoggedInUserOnly, kycImage)
app.use('/adharImage', restrictToLoggedInUserOnly, adharImage)
app.use('/adharBack', restrictToLoggedInUserOnly, adharBackImage)







// employeeRouter
app.use('/employee', employeeRouter)



// Render the HTML file
app.get('/upload', (req, res) => {

  const sessionID = req.cookies.sessionID;

  if (!sessionID) {
    return res.status(400).json("unauthorized! Please login")
  }

  const filePath = path.join(viewsDir, "talentTracker", 'uploadExcel.html');

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




// finzee-routes
// app.use('/finzy', finzyRouter);


/****************************Augment Routes **************************************/



app.use('/products', restrictToLoggedInUserOnly, product)
app.use('/Rates', goldRates)
app.use('/passbook', restrictToLoggedInUserOnly, getPassbook)
app.use('/userbank', restrictToLoggedInUserOnly, bankaccount)
app.use('/banklist', bankList)
// app.use('/orderlist',restrictToLoggedInUserOnly, OrderList);
app.use('/redeem', redeemPostOrder);
app.use('/order', restrictToLoggedInUserOnly, orderInfo);
// app.use('/statelist', statelist)



app.use('/augmont', augmontRouter)





app.get('/', (req, res) => {
  res.json("home page")

})






// website: dashboard
// const userDashboard = require('./routes/routes.js')

// app.use('/script', express.static(path.join(__dirname, 'script')));
// app.use('/html', express.static(path.join(__dirname, 'html')));
// app.use(express.static(path.join(__dirname, 'assets')));



// app.use('/dashboard', userDashboard)

app.listen(PORT, console.log("server started at port:", PORT));


