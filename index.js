
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./db');
const customeTradeRoute = require('./routes/customRoutes/customTrade.router.js');
const cors = require('cors')
const cookieParser = require('cookie-parser');



//connect to database
connectDB();


const {restrictToLoggedInUserOnly} = require('./middlewares/auth.middleware.js')

const userRoute = require('./routes/mmtcRoutes/user.router.js')
const tradeRoute = require('./routes/mmtcRoutes/trade.router.js');
const resisterUserRoute= require('./routes/customRoutes/security.router.js');
 const addressRouter=require('./routes/customRoutes/address.router.js');
const nomineeRouter=require('./routes/customRoutes/nominee.router.js');
const preferenceRouter=require('./routes/customRoutes/preference.router.js');
const priceRouter=require('./routes/customRoutes/price.router.js');
 const activeRouter=require('./routes/customRoutes/active.router.js')
const panRouter=require('./routes/customRoutes/verifyPan.router.js')
const logoutRouter = require('./routes/customRoutes/logout.router.js')
const userUpdateRouter = require('./routes/customRoutes/userUpdate.router.js')


dotenv.config();
const PORT =  process.env.PORT || 1337;
const app = express();
app.use(express.json())

app.use(cors());
app.use(cookieParser());

/*          MMTC  API    */

// userRoutes
app.use('/user', userRoute)  


// trade
app.use('/trade', tradeRoute)





/*    Custom API      */

//custom
app.use('/customUser', resisterUserRoute)

app.use('/customTrade', restrictToLoggedInUserOnly, customeTradeRoute)

 app.use('/address', restrictToLoggedInUserOnly, addressRouter)
app.use('/nominee',nomineeRouter)
app.use('/preference',preferenceRouter)
app.use('/pan', restrictToLoggedInUserOnly, panRouter)

// price
app.use('/price', priceRouter);
 app.use('/act', restrictToLoggedInUserOnly, activeRouter);

 //update user
 app.use('/users', restrictToLoggedInUserOnly, userUpdateRouter)

//logout
// app.use('/logout',restrictToLoggedInUserOnly, logoutRouter)
app.use('/logout', restrictToLoggedInUserOnly, logoutRouter)

app.get('/', (req, res)=>{
res.json("home page")

})






app.listen(PORT, console.log("server started at port:", PORT));


