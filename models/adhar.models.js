const mongoose=require('mongoose');


const adharSchema=new mongoose.Schema({

    "customerRefNo": {
        type: String,
    },
    // "msg":{
    //     type:Object
    //   },

    "msg": {
        "Aadhar_No":String,
        "Address":"String",
        "Careof":String,
        "Country":String,
        "DOB":String,
        "District":String,
        "Document_link":String,
        "Gender":String,
        "House":String,
        "Image":String,
        "Landmark":String,
        "Locality":String,
        "Name":String,
        "Pincode":String,
        "Post_Office":String,
        "Relatationship_type":String,
        "Relative_Name":String,
        "Share_Code":String,
        "State":String,
        "Street":String,
        "Sub_District":String,
        "Village/Town/City":String










    },
    "status":Number

},{ timestamps: true })
const adharModel=mongoose.model('adhar',adharSchema);
module.exports=adharModel
