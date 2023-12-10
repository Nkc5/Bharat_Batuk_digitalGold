
const mongoose = require('mongoose');

const preferenceSchema = new mongoose.Schema({
    customer_ref: String,
    incomeRange: String,
    occupation: String,
    MartialStatus: String,
    instruments: String,
    appUse: String,
    savingPercentage: String,
    savingsFor: String,
    language: String,
    speakAboutBatuk: String,
    featuresInBatuk: String,
    featuresToAdd: String,
    dontLike: String,
    feedback: String
})
const Preference = mongoose.model('Preference', preferenceSchema);

module.exports = Preference;


//const preferenceModel = mongoose.model('preference', preferenceSchema);

