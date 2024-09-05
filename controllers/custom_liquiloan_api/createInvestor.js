
const userModel = require('../../models/user.models.js')
const bankModel = require('../../models/bank.models.js')
const addressModel = require('../../models/address.models.js')
const liquiLoanModel = require('../../models/isInvestor.model.js')
const axios = require('axios');
const crypto = require('crypto');
const { format } = require('date-fns');


class Investors {

    
  
      createChecksum = async (AadhaarNumber, AccountNumber, DOB, Email, FullName, Gender, IFSC, InvestorType, MobileNumber, PanNumber, Password, Timestamp)=> {
        const key = process.env.LL_Key;
    
        const concatenatedString = `${AadhaarNumber.trim()}||${AccountNumber.trim()}||${(DOB).trim()}||${Email.trim()}||${(FullName).trim()}||${Gender.trim()}||${IFSC.trim()}||${(InvestorType).trim()}||${MobileNumber.trim()}||${PanNumber.trim()}||${Password.trim()}||${Timestamp.trim()}`;
        
        const hmac = crypto.createHmac('sha256', key);
    
        hmac.update(concatenatedString);  
    
        const checksum = hmac.digest('hex');

        return checksum.toString();
    }
    



     createInvestor =async (req, res)=> {

console.log("req.user", req.user);
const customerRefNo = req.user._id.toString();

        try {
                    
        const customerRefNo = req.user._id.toString();
        const user = await userModel.findOne({_id: customerRefNo});
        const bank = await bankModel.findOne({customerRefNo}).sort({_id:-1});
        const address = await addressModel.findOne({$and: [ {customerRefNo: customerRefNo}, {type:'B'}, {is_deleted:0} ]}).sort({_id: -1});

        console.log("bank", bank);
        console.log("address", address);

        const dob = user.dob.split('-').reverse().join('-');
        console.log("dob", dob);

        const currentDate = new Date();
    const formattedDate = format(currentDate, 'yyyy-MM-dd HH:mm:ss');
    // (AccountNumber, DOB, Email, FullName, Gender, IFSC, InvestorType, MobileNumber, PanNumber, Timestamp)
    const start = {AccountNumber: bank.msg.account_no, DOB: dob, Email:  user.email, FullName: user.name, Gender: user.gender, IFSC: bank.msg.ifsc, InvestorType: "Internal",MobileNumber: user.phone, PanNumber: user.pan_number, Timestamp: formattedDate}

    console.log("start", start);

        const data = {

            "checksum": await this.createChecksum("", bank.msg.account_no, dob,  user.email,  user.name,  user.gender,  bank.msg.ifsc, "Internal", user.phone, user.pan_number, "", formattedDate),
            "mid": process.env.MID,
            "ifa_id": null,
            "timestamp": formattedDate,
            "personal_details": {
                "pan_number": user.pan_number,
                "email": user.email,
                "mobile_number": user.phone,
                "aadhaar_number": "",
                "full_name": user.name,
                "investor_type": "Internal",
                "gender": user.gender,
                "holding_type": "ARN",
                "dob": dob,
        "password": ""
            },
            "banking_details": {
                "ifsc": bank.msg.ifsc,
                "account_number": bank.msg.account_no,
                "bank_name": bank.msg.Bankname,
                "bank_branch":  bank.msg.Branchname,
                "account_name":  bank.msg.name
            },
            "address_details": {
                "address_line1": address.line1,
                "city": address.city,
                "pincode": address.zip.toString(),
                "state": address.state
            },
            "other_details": {
                "ckyc_no": ""
            }
        
        }

        console.log("data", data);

        const response = await axios.post('https://sup-integration-stage.liquiloan.in/api/v2/CreateInvestor', data, {
            headers: {
                'Content-Type': 'application/json'
            }
        })

        console.log("response", response.data);

        const userLiqui = await liquiLoanModel.create({
            customerRefNo,
            investorId: response.data.data.investor_id,
            banking_id: response.data.data.banking_id
        })

        console.log("userLiqui", userLiqui);

        return res.status(200).json(response.data)


    } 
    catch (error) {
        console.log(error);
        return res.status(400).json(error);
    }




    }


}





module.exports = Investors;







    
    // dynamicChecksum(...args) {

    //     const key = process.env.LL_Key;
    //     const length = args.length;
    //     console.log("length", args.length);

    //     const sum =""
    //     for(const i=0; i<length; i++){
    //         if(i==length-1){
    //             sum += 
    //         }
    //     }

    //     for (const num of args) {
    //         if(i==length-1){
    //             if(num != in)
    //             sum += num;
    //         }
    //         else{
    //             sum += num + "||";
    //         }
    //       }
    //       return sum;
    //     }



    
    //     // Concatenate the values with '||' separator
    //     const concatenatedString = `${Number(InvestorId)}||${Timestamp.trim()}`;
    
    //     // Create an HMAC (Hash-based Message Authentication Code) using the SHA-256 algorithm
    //     const hmac = crypto.createHmac('sha256', key);
    
    
    //     // Update the HMAC object with the concatenated string
    //     hmac.update(concatenatedString);
    
    
    //     // Get the hexadecimal representation of the HMAC
    //     const checksum = hmac.digest('hex');
    
    
    //     return checksum;
    // }
    

