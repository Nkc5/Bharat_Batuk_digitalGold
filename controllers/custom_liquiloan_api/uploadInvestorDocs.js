
const axios = require('axios');
const crypto = require('crypto');
const { format } = require('date-fns');
const isInvestor = require('../../models/isInvestor.model.js')




module.exports = async (req, res) => {

    const customerRefNo = req.user._id.toString();

    // const {document_type} = req.body;

    const user = isInvestor.findOne({customerRefNo})

    const date = new Date();
    const formattedDate = format(currentDate, 'yyyy-MM-dd HH:mm:ss');


    try {

        if(user){

    const data = {
        timestamp: formattedDate,
        checksum: await createCheckSum("PAN Card",  user.investorId, formattedDate),
        investor_id: user.investorId,
        document_type: "PAN Card",
        mid: process.env.MID,
        file:`/kycImages/${customerRefNo}`
    }


    const response = await axios('https://sup-integration-stage.liquiloan.in/api/v2/UploadInvestorDocs', data, {
        headers: {
            'Content-Type': 'application/json'
        }
    })

    return res.status(200).json({
        error: false,
        message: "success response",
        data: [
            response.data
        ]
    })
}


return res.status(400).json({
    error: true,
    message: "no investor found",
    data: []
})

  
} catch(error) {
    console.log("error", error);
    return res.status(400).json({
        errror: true,
        message: error,
        data: []
    })       
}


}





async function createCheckSum(DocumentType, investorId, Timestamp){
    const concatenatedString = DocumentType.trim() + "||"+"||"+investorId.trim()+"||"+Timestamp.trim()

    const hmac = crypto.createHmac('sha256', key);
    hmac.update(concatenatedString);
    const checksum = hmac.digest('hex');
    return checksum;
    
}



