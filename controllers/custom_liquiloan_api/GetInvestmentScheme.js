
const axios = require('axios');
const crypto = require('crypto');
const { format } = require('date-fns');
const userModel = require('../../models/user.models.js');
const isInvestor=require('../../models/isInvestor.model.js')

class GetInvestmentSummary {
    constructor() {
        this.scheme = this.scheme.bind(this);
    }

    scheme = async (req, res) => {
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
            const investment_type="Investment";

            // if (!user) {
            //     console.log("User not found for investor_id:", investor_id);
            //     return res.status(404).json({ error: "User not found" });
            // }

            // const customerRefNo = user.customerRefNo; // Adjust the property name based on your actual model

            const Checksum = this.createChecksum1(investment_type,investor_id, formattedDate);
            console.log("checksome",Checksum)
            const data = {
                // "investor_id": Number(investor_id),
                "investor_id": investor_id,
                "investment_type":investment_type,
                "timestamp": formattedDate,
                "checksum": Checksum,
                "mid": "M004914"
            };

            console.log("Data", data);

            const response = await axios.post('https://sup-integration-stage.liquiloan.in/api/v2/GetInvestmentScheme', data);
            const investorData = new isInvestor({
                scheme_id:response.data.data[0].scheme_id,
            investment_type:response.data.data[0].investment_type,
            shceme_mhp:response.data.data[0].shceme_mhp,
             payout_type:response.data.data[0].payout_type,
               roi:response.data.data[0].roi,
               interest_calculation_type:response.data.data[0].interest_calculation_type,
               scheme_type:response.data.data[0].scheme_type,
               scheme_name:response.data.data[0].scheme_name,
double_advantage_scheme:response.data.data[0].double_advantage_scheme,
lockin_type:response.data.data[0].lockin_type,
min_amount:response.data.data[0].min_amount,
max_amount:response.data.data[0].max_amount
                
                // Add other fields as needed
            });

            await investorData.save();
            console.log("in dashboard", response.data);
            console.log("investorData",investorData)

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

    // Method to create checksum
       
 createChecksum1(investment_type,InvestorId,Timestamp) {
    console.log("Hii")

    const key = "DD9C6CE9D86C3";

    // Concatenate the values with '||' separator
    // const concatenatedString = `${InvestorId.trim()}||${Timestamp.trim()}`;
    // const concatenatedString = `${String(InvestorId).trim()}||${String(investment_type).trim()}||${Timestamp.trim()}`;
    const concatenatedString = `${String(investment_type).trim()}||${String(InvestorId).trim()}||${Timestamp.trim()}`;

    // Create an HMAC (Hash-based Message Authentication Code) using the SHA-256 algorithm
    const hmac = crypto.createHmac('sha256', key);


    // Update the HMAC object with the concatenated string
    hmac.update(concatenatedString);


    // Get the hexadecimal representation of the HMAC
    const checksum = hmac.digest('hex');


    return checksum;
}

}

const isInvestment = new GetInvestmentSummary();

module.exports = isInvestment;
