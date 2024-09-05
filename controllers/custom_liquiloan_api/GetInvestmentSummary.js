const axios = require('axios');
const crypto = require('crypto');
const { format } = require('date-fns');
const userModel = require('../../models/user.models.js');
const isInvestor = require('../../models/isInvestor.model.js');

class GetInvestorSummary {
    constructor() {
        this.Getsummary = this.Getsummary.bind(this);
    }
    async Getsummary(req, res) {
        try {
            const customerRefNo = req.user._id.toString();
            console.log("cust", customerRefNo);
            const user = await isInvestor.findOne({ customerRefNo });
           
            console.log("user", user);
            // const InvestorId=user.investorId;
            // console.log("InvestorId",InvestorId)

            const currentDate = new Date();
            const formattedDate = format(currentDate, 'yyyy-MM-dd HH:mm:ss');

            const Checksum = this.createChecksum1(user.investorId, formattedDate);
            // console.log("checksome", Checksum);

            const data = {
                "mid": "M004914",
                "Investor ID": Number(user.investorId),
                "Timestamp": formattedDate,
                "checksum": Checksum,
            };
            console.log("data", data);

            // const response = await axios.post('https://sup-integration-stage.liquiloan.in/api/v2/GetInvestorDashboard', data);
            // console.log("response", response);

            // return res.json(response.data);
            console.log("hii")  
        const response = await axios.post('https://sup-integration-stage.liquiloan.in/api/v2/GetInvestmentSummary', data, {
      
        
            headers: {
                'Content-Type': 'application/json'
            }
        })
        console.log("response",response)

        // console.log("response", response.data);
        return res.status(200).json({
            error: false,
            message: "success",
            data: [response.data]
        })


    }
    catch (error) {
        console.log("error", error);
        return res.status(400).json({
            error: true,
            message: error,
            data: []
        })
    
    }}


    //     } catch (error) {
    //         console.error("Error in GetInvestmentSummary:", error);
    //         return res.status(500).json({ error: "Internal Server Error" });
    //     }
    // }


     createChecksum1(InvestorId, Timestamp) {

        const key = "DD9C6CE9D86C3";
    
        // Concatenate the values with '||' separator
        const concatenatedString = `${Number(InvestorId)}||${Timestamp.trim()}`;
    
        // Create an HMAC (Hash-based Message Authentication Code) using the SHA-256 algorithm
        const hmac = crypto.createHmac('sha256', key);
    
    
        // Update the HMAC object with the concatenated string
        hmac.update(concatenatedString);
    
    
        // Get the hexadecimal representation of the HMAC
        const checksum = hmac.digest('hex');
    
    
        return checksum;
    }
    
}

const dashboard1= new GetInvestorSummary();

module.exports = dashboard1;
