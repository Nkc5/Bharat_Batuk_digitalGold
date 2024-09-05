const axios = require('axios');
const crypto = require('crypto');
const { format } = require('date-fns');
const isInvestor = require('../../models/isInvestor.model.js');

class GetInvestorDashboard {
    constructor() {
        this.dashboard = this.dashboard.bind(this);
    }

    dashboard = async (req, res) => {
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

            const response = await axios.post('https://sup-integration-stage.liquiloan.in/api/v2/GetInvestorDashboard', data);
            console.log("in dashboard", response.data);
//             const investorData = new isInvestor({
//                 current_value:response.data.data[0].current_value,
//                 withdrawable_amount:response.data.data[0].withdrawable_amount,
//                 locked_in_amount_bal:response.data.data[0].locked_in_amount_bal,
//                 flexi_locked_in_withdrawable_amount:response.data.data[0].flexi_locked_in_withdrawable_amount,
//                 total_principal_investment:response.data.data[0].total_principal_investment,
//                 annualized_return:response.data.data[0].annualized_return,
//                 requested_investment:response.data.data[0].requested_investment,


                

// //                 scheme_id:response.data.data[0].scheme_id,
// //             investment_type:response.data.data[0].investment_type,
// //             shceme_mhp:response.data.data[0].shceme_mhp,
// //              payout_type:response.data.data[0].payout_type,
// //                roi:response.data.data[0].roi,
// //                interest_calculation_type:response.data.data[0].interest_calculation_type,
// //                scheme_type:response.data.data[0].scheme_type,
// //                scheme_name:response.data.data[0].scheme_name,
// // double_advantage_scheme:response.data.data[0].double_advantage_scheme,
// // lockin_type:response.data.data[0].lockin_type,
// // min_amount:response.data.data[0].min_amount,
// // max_amount:response.data.data[0].max_amount
                
//                 // Add other fields as needed
//             });

//             await investorData.save();

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


}

const dashboard1 = new GetInvestorDashboard();
module.exports = dashboard1;
