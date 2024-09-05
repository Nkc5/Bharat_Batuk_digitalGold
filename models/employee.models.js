


const mongoose = require('mongoose');


const DynamicSchema = new mongoose.Schema({
  // Use the Mixed type for all fields

}, { strict: false });

// Create a model based on the flexible schema
const DynamicModel = mongoose.model('DynamicModel', DynamicSchema);



module.exports = DynamicModel;


