const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({


    "custRefNo":String, 

 

    // android 
    'android_version_sdkInt': String,
    'android_version_release': String,
    'android_board': String,
    'android_brand': String,
    'android_device': String,
    'android_fingerprint': String,
    'android_host': String,
    'android_id': String,
    'android_manufacturer': String,
    'android_model': String,
    'android_product': String,
    'android_isPhysicalDevice': String,
    'android_serialNumber': String,


    // ios
    'ios_name': String,
    'ios_systemName': String,
    'ios_systemVersion': String,
    'ios_model': String,
    'ios_localizedModel': String,
    'ios_identifierForVendor': String,
    'ios_isPhysicalDevice': String,
    'ios_utsname_sysname': String,
    'ios_utsname_nodename': String,
    'ios_utsname_release': String,
    'ios_utsname_version': String,
    'ios_utsname_machine': String,

}, { timestamps: true })



const deviceModel = mongoose.model('device', deviceSchema)


module.exports = deviceModel;