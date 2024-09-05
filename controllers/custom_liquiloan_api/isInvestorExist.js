




const axios = require('axios');
const crypto = require('crypto');
const { format } = require('date-fns');
const userModel = require('../../models/user.models.js');
const isInvestor=require('../../models/isInvestor.model.js')

class Isinvestors {
    IsInvestorExist = async (req, res) => {
        try {
            const customerRefNo = req.user._id.toString();
            console.log("cust",customerRefNo)
            const user = await userModel.findOne({ _id: customerRefNo });
            console.log(user)

            const currentDate = new Date();
            const formattedDate = format(currentDate, 'yyyy-MM-dd HH:mm:ss');

            if (!user.pan_number || !user.phone || !user.email) {
                return res.status(400).json({ error: "Mandatory Parameter missing" });
            }

            const Checksum = this.createChecksum11(user.pan_number, user.phone, user.email, formattedDate);
            console.log("checksome",Checksum)

            const data = {
                "email": user.email,
                "pan_number": user.pan_number,
                "mobile_number": user.phone,
                "timestamp": formattedDate,
                "checksum": Checksum,
                "mid": process.env.MID
            };
            console.log("data",data)

            const response = await axios.post('https://sup-integration-stage.liquiloan.in/api/v2/IsInvestorExist', data);
            const investorData = new isInvestor({
                investorId: response.data.data[0].investor_id,
                customerRefNo

                
                // Add other fields as needed
            });

            await investorData.save();
     
        return res.json(response.data);

        } catch (error) {
            console.error("Error in IsInvestorExist:", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    };


    // async dashboard( req, res) {

        summary = async (req, res) => {
        const currentDate = new Date();
        const formattedDate = format(currentDate, 'yyyy-MM-dd HH:mm:ss');

        try {
            // Assuming you have a model for your data (replace 'YourModel' with your actual model)
            const customerRefNo = req.user._id.toString();
            console.log("cust", customerRefNo);
            const user12 = await isInvestor.findOne({ customerRefNo });
            console.log("User:", user12);
            // const investor_id = await isInvestor.findOne({ investorId: Number(user12.investorId) });
            const investor_id=user12.investorId;
            // var investorId=req.user.investorId
            console.log("investor",investor_id)

            // if (!user) {
            //     console.log("User not found for investor_id:", investor_id);
            //     return res.status(404).json({ error: "User not found" });
            // }

            // const customerRefNo = user.customerRefNo; // Adjust the property name based on your actual model

            const Checksum = this.createChecksum1(investor_id, formattedDate);
            const data = {
                // "investor_id": Number(investor_id),
                "investor_id": investor_id,
                "timestamp": formattedDate,
                "checksum": Checksum,
                "mid": "M004914"
            };

            console.log("Data", data);

            const response = await axios.post('https://sup-integration-stage.liquiloan.in/api/v2/GetInvestmentSummary', data);
            console.log("in dashboard", response.data);

            // return res.status(200).json(response.data);
            return res.status(200).json({
                error:false,
                message:true,
                data:[response.data]

            })
        } catch (error) {
            console.error("Error in dashboard:", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }
    
     
 createChecksum1(InvestorId, Timestamp) {
    console.log("Hii")

    const key = "DD9C6CE9D86C3";

    // Concatenate the values with '||' separator
    // const concatenatedString = `${InvestorId.trim()}||${Timestamp.trim()}`;
    const concatenatedString = `${String(InvestorId).trim()}||${Timestamp.trim()}`;

    // Create an HMAC (Hash-based Message Authentication Code) using the SHA-256 algorithm
    const hmac = crypto.createHmac('sha256', key);


    // Update the HMAC object with the concatenated string
    hmac.update(concatenatedString);


    // Get the hexadecimal representation of the HMAC
    const checksum = hmac.digest('hex');


    return checksum;
}



     createChecksum11(pan_number, phone, email, formattedDate) {
    const key = "DD9C6CE9D86C3";
    const concatenatedString = `${pan_number.trim()}||${phone.trim()}||${email.trim()}||${formattedDate.trim()}`;
    const hmac = crypto.createHmac('sha256', key);
    hmac.update(concatenatedString);
    const checksum = hmac.digest('hex');
    return checksum;
}
}

const isInvestorsInstance = new Isinvestors();

module.exports = isInvestorsInstance;
