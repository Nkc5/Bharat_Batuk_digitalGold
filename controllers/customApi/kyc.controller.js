
const panModel = require('../../models/pan.models.js');
const adharModel = require('../../models/adhar.models.js');
const bankModel = require('../../models/bank.models.js');
const userModel = require('../../models/user.models.js');
const addressModel = require('../../models/address.models.js');
const stateModel = require('../../models/state.models.js');


class KYC {

    constructor(){
        // if arrow function: which automatically bind this lexically, ensuring that it refers to the instance of the class
        // else manually
        this.adharDetails = this.adharDetails.bind(this);
        this.panDetails = this.panDetails.bind(this);
        this.bankDetails = this.bankDetails.bind(this);
        this.adharDetailsInUserDB = this.adharDetailsInUserDB.bind(this);
        this.replaceSpaceWithUnderscore = this.replaceSpaceWithUnderscore.bind(this);
    }


    async panDetails(req, res) {
        const customerRefNo = req.user._id;
        const data = req.body;
        try {

            const response = await panModel.create({...data, customerRefNo});
            const user = await userModel.findOneAndUpdate({_id:customerRefNo}, {pan_number: response.msg.PanNumber, dob: response.msg.dob, email: response.msg.email , kyc_status: 1}, {new: true});
        
            if(!user.name){
                user.name = response.msg.NameOnTheCard;
                await user.save();
            }

            console.log("user", user);
            return res.status(200).json({
                error: false,
                message: 'pan details successfuly registered',
                data: [response]
            })
        }
        catch(error) {
            console.log("error", error);
            return res.status(400).json({
                error: true,
                message: error,
                data: []
            })
        }


    }

    async adharDetails(req, res) {

        const customerRefNo = req.user._id.toString();
        var data = req.body;

        try {
            var data= await this.replaceSpaceWithUnderscore(data);
            const response = await adharModel.create({...data, customerRefNo});

             res.status(200).json({
                error: false,
                message: 'adhar details successfuly registered',
                data: [response]
            })

            this.adharDetailsInUserDB(customerRefNo, response);
        }
        catch (error) {
            console.log("error", error);
            return res.status(400).json({
                error: true,
                message: error,
                data: []
            })
        }


    }

    async bankDetails(req, res) {
        
        const customerRefNo = req.user._id;
        const data = req.body;
        try {

            const response = await bankModel.create({...data, customerRefNo});
            return res.status(200).json({
                error: false,
                message: 'bank details successfuly registered',
                data: [response]
            })
        }
        catch (error) {
            console.log("error", error);
            return res.status(400).json({
                error: true,
                message: error,
                data: []
            })
        }



    }


 

     getKycDetails= async (req, res)=>{
        const customerRefNo = req.user._id.toString();

        console.log("in get kyc")
        try {
         
        const panResponse = await panModel.findOne({customerRefNo}).sort({_id: -1});
        const adharResponse = await adharModel.findOne({customerRefNo}).sort({_id: -1});
        const bankResponse = await bankModel.findOne({customerRefNo}).sort({_id: -1});

        console.log("panResponse", panResponse);
        console.log("bankResponse", bankResponse);
        console.log("bankResponse", bankResponse);

        if(panResponse || adharResponse || bankResponse){

            return res.status(200).json({
                error: false,
                message: 'kyc data successfuly get',
                data: [{
                    adhar: adharResponse ? adharResponse : {},
                    pan: panResponse ? panResponse : {},
                    bank: bankResponse ? bankResponse : {}
                }]
            })
        }

        else{
            return res.status(200).json({
                error: false,
                message: 'no data found',
                data: [{
                    adhar: {},
                    pan:  {},
                    bank: {}
                }]
            })
        }
   
    } 
    catch (error) {
        console.log("error", error);
        return res.status(400).json({
            error: true,
            message: error,
            data: []
        })
    }

    }

    // async replaceSpaceWithUnderscore(obj){

    //     console.log("obj", obj);
    //     const modifiedObj = {}; 

    //     try {
            
    //     Object.keys(obj).forEach((key) => {
    //         const newKey = key.replace(/ /g, '_'); 
    //         if (typeof obj[key] === 'object') {
    //             const modifiedValue = {};
    //             Object.keys(obj[key]).forEach((nestedKey) => {
    //                 const newNestedKey = nestedKey.replace(/ /g, '_'); 
    //                 modifiedValue[newNestedKey] = obj[key][nestedKey];
    //             });
    //             modifiedObj[newKey] = modifiedValue;
    //         } else {
    //             modifiedObj[newKey] = obj[key];
    //         }
    //     });
    
    //     console.log(modifiedObj); 

    //     return modifiedObj;

    // } 
    // catch (error) {
    //     return console.log("error", error);
    // }

    // }



    // faster with reccursion
    async replaceSpaceWithUnderscore(obj) {
        if (!obj || typeof obj !== 'object') {
            return obj;
        }
        const modifiedObj = {};
        try {
            for (const key in obj) {
                if (Object.hasOwnProperty.call(obj, key)) {
                    const newKey = key.replace(/ /g, '_');
    
                    // Recursively process nested objects
                    if (typeof obj[key] === 'object' && obj[key] !== null) {
                        modifiedObj[newKey] = await this.replaceSpaceWithUnderscore(obj[key]);
                    } else {
                        modifiedObj[newKey] = obj[key];
                    }
                }
            }
            return modifiedObj;
        } catch (error) {
           return console.error("Error in replaceSpaceWithUnderscore:", error);
        }
    }

    


    async adharDetailsInUserDB(customerRefNo, response){
        // const newResponse = response.msg.Address.split(',');
        // const pin = Number(newResponse[newResponse.length-1]);
        // const country = newResponse[newResponse.length-2].trim();
        // const state = newResponse[newResponse.length-3].trim();
        // const city = newResponse[newResponse.length-4].trim();

        try {

        const user = await userModel.findOneAndUpdate({_id:customerRefNo}, {
            state: response.msg.State,
            name: response.msg.Name,
            city: response.msg["Village/Town/City"],
            dob: response.msg.DOB,
            kyc_status: 1,
            gender: response.msg.Gender,
            adharUrl: response.msg.Image
        }, {new: true});
 
        console.log("user", user);
        console.log("user phone", user.phone);

        const stateDB = await stateModel.findOne({name:  response.msg.State});
        console.log("state", stateDB);

        const address = await addressModel.create({
            customerRefNo,
            city: response.msg["Village/Town/City"],
            country:  response.msg.Country,
            line1: response.msg.Address,
            lin2: response.msg.District,
            mobileNumber: user.phone,
            name: user.name,
            state: response.msg.State,
            statecode: stateDB.state_code,
            type: "B",
            zip:Number(response.msg.Pincode),
        })

        return console.log("address", address);
    } 
    catch (error) {
     return console.log("error", error)   
    }


    } 





}


module.exports = KYC;

