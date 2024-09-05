const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}


const augmontDatabase = async () =>{

  try {
    const augmontConn  = await mongoose.createConnection(process.env.MONGO_URL2);
    console.log(`MongoDB Connected (Augmont)`);
    return augmontConn;
  } catch (error) {
    console.error(error.message);
    return process.exit(1);
  }
  finally{
    await augmontConn .close();
  }
}
module.exports = {connectDB, augmontDatabase};