const axios = require('axios');
const finzeeModel = require('../../models/finzee.models.js');

const uploadDocuments = async (req, res) => {

    const uploadDocuments = req.files;
    const additionalData = req.body;

    console.log("file", req.file);
    console.log("body", req.body);

    const formData = new FormData();

    try {

        uploadDocuments.forEach(file => {
            formData.append('documents', file.buffer, file.orginalname);
        })
        formData.append('additionalData', JSON.stringify(additionalData));

        console.log("formData", formData);

        const user = await finzeeModel.findOne({customerRefNo});

        const response = await axios.post(`https://uatapis.finzy.com/v1/documents/LENDER/${user.lenderId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'partner-code':process.env.PartnerCode,
                'x-api-key': process.env.finzyApikey
            }
        })

        console.log("response", response.data);

        return res.status(200).json({
            error: false,
            message: "success",
            data: [
                response.data
            ]
        })

    } catch (error) {
        console.log("error", error);
        return res.status(400).json({
            error: true,
            message: error
        })
    }


}


module.exports = uploadDocuments;