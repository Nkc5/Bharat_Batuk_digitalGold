

// const axios = require('axios');
// const { userAugmontModel, tokenAugmontModel } = require('../../models/augmont/user_augmont.js');
// const { buyInvoiceModel, redeemInvoiceModel, sellInvoiceModel } = require('../../models/augmont/invoice.js');
// const fs = require('fs');


// const buyInvoice = async (req, res) => {

//     const customerRefNo = req.user._id.toString();

//     const { transactionID } = req.params;

//     const user = await userAugmontModel.findOne({ customerRefNo }).sort({ _id: -1 });
//     const token = await tokenAugmontModel.findOne().sort({ _id: -1 });


//     try {

//         const response = await axios.get(`${process.env.Augmont_URL}/merchant/v1/invoice/${transactionID}`, {
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Accept': 'application/json',
//                 'Authorization': `Bearer ${token.token_augmont}`
//             }
//         })
//         const responseDataString = JSON.stringify(response.data, null, 2);

//         // Write the response data to a file
//         // fs.writeFileSync(filePath, responseDataString);

//         // console.log('Response data saved to file:', filePath);


//         const DBresponse = await buyInvoiceModel.create({ ...response.data });
//         console.log("DBresponse", DBresponse);

//         return res.status(200).json({
//             error: false,
//             message: 'succes',
//             data: [response.data]
//         })


//     } catch (error) {
//         console.log("error", error.response.data);

//         return res.status(400).json({
//             error: true,
//             statusCode: error.response.data.statusCode,
//             message: error.response.data.message,
//             data: []
//         })
//     }
// }




// const redeemInvoice = async (req, res) => {

//     const customerRefNo = req.user._id.toString();
//     const { transactionID } = req.params;

//     const user = await userAugmontModel.findOne({ customerRefNo }).sort({ _id: -1 });
//     const token = await tokenAugmontModel.findOne().sort({ _id: -1 });


//     try {

//         const response = await axios.get(`${process.env.Augmont_URL}/merchant/v1/invoice/order/${transactionID}`, {
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Accept': 'application/json',
//                 'Authorization': `Bearer ${token.token_augmont}`
//             }
//         })


//         const DBresponse = await redeemInvoiceModel.create({ ...response.data });
//         console.log("DBresponse", DBresponse);


//         return res.status(200).json({
//             error: false,
//             message: 'succes',
//             data: [response.data]
//         })


//     } catch (error) {
//         console.log("error", error.response.data);

//         return res.status(400).json({
//             error: true,
//             statusCode: error.response.data.statusCode,
//             message: error.response.data.message,
//             data: []
//         })
//     }
// }

// const sellInvoice = async (req, res) => {
//     const customerRefNo = req.user._id.toString();
//     const { transactionID } = req.params;

//     const user = await userAugmontModel.findOne({ customerRefNo }).sort({ _id: -1 });
//     const token = await tokenAugmontModel.findOne().sort({ _id: -1 });

//     try {

//         const response = await axios.get(`${process.env.Augmont_URL}/merchant/v1/invoice/sell/${transactionID}`, {
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Accept': 'application/json',
//                 'Authorization': `Bearer ${token.token_augmont}`
//             }
//         })

//         const DBresponse = await sellInvoiceModel.create({ ...response.data });
//         console.log("DBresponse", DBresponse);

//         return res.status(200).json({
//             error: false,
//             message: 'succes',
//             data: [response.data]
//         })


//     } catch (error) {
//         console.log("error", error.response.data);

//         return res.status(400).json({
//             error: true,
//             statusCode: error.response.data.statusCode,
//             message: error.response.data.message,
//             data: []
//         })
//     }
// }


// module.exports = {
//     buyInvoice,
//     redeemInvoice,
//     sellInvoice
// }





const axios = require('axios');
const { userAugmontModel, tokenAugmontModel } = require('../../models/augmont/user_augmont.js');
const { buyInvoiceModel, redeemInvoiceModel, sellInvoiceModel } = require('../../models/augmont/invoice.js');
const fs = require('fs');
const path = require('path');

const pdf = require('html-pdf');
// const pdfroute = require("./routes/pdf.js");

// const pdfTemplate = require('./views/buy_invoice.html');


const buyInvoice = async (req, res, type) => {
    const customerRefNo = req.user._id.toString();
    const { transactionID } = req.params;

    try {
        const user = await userAugmontModel.findOne({ customerRefNo }).sort({ _id: -1 });
        const token = await tokenAugmontModel.findOne().sort({ _id: -1 });

        const response = await axios.get(`${process.env.Augmont_URL}/merchant/v1/invoice/${transactionID}`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token.token_augmont}`
            }
        });

        // Check if response is undefined
        if (!response || !response.data) {
            throw new Error('Empty response or missing response data');
        }

        const responseData = response.data;

        let filledTemplate; // Declare filledTemplate variable here

        // Use the response data to replace placeholders in the HTML template
        // let data;
        // if (type == "Invoice") {
        //     data = "buy_invoice.html"
        // }
        const htmlContent = fs.readFileSync(path.resolve(__dirname, '../../views/buy_invoice.html'), 'utf-8');
        filledTemplate = htmlContent
            .replace('%INVOICENUMBER%', responseData.result.data.invoiceNumber)
            .replace('%TRANSACTIONID%', responseData.result.data.transactionId)
            .replace('%NAME%', responseData.result.data.userInfo.name)
            .replace('%ADDRESS%', responseData.result.data.userInfo.address ? responseData.result.data.userInfo.address : '')
            .replace('%CITY%', responseData.result.data.userInfo.city ? responseData.result.data.userInfo.city : '')
            .replace('%STATE%', responseData.result.data.userInfo.state)
            .replace('%PINCODE%', responseData.result.data.userInfo.pincode ? responseData.result.data.userInfo.pincode : '')
            .replace('%MOBILE%', responseData.result.data.userInfo.mobileNumber ? responseData.result.data.userInfo.mobileNumber : '')
            .replace('%EMAIL%', responseData.result.data.userInfo.email ? responseData.result.data.userInfo.email : "")
            .replace('%UNIQUEID%', responseData.result.data.userInfo.uniqueId)
            .replace('%HSNCODE%', responseData.result.data.hsnCode)
            .replace('%QUANTITY%', responseData.result.data.quantity)
            .replace('%QUANTITY1%', responseData.result.data.quantity)
            .replace('%RATE%', responseData.result.data.rate)
            .replace('%CGSTTAXPERCENT%', responseData.result.data.taxes.taxSplit[0].taxPerc)
            .replace('%CGSTTAXAMOUNT%', responseData.result.data.taxes.taxSplit[0].taxAmount)
            .replace('%SGSTTAXAMOUNT%', responseData.result.data.taxes.taxSplit[1].taxAmount)
            .replace('%SGSTTAXPERCENT%', responseData.result.data.taxes.taxSplit[1].taxPerc)
            .replace('%IGSTTAXPERCENT%', responseData.result.data.taxes.taxSplit[1].taxPerc)
            .replace('%IGSTTAXAMOUNT%', responseData.result.data.taxes.taxSplit[1].taxAmount)
            .replace('%GROSSAMOUNT%', responseData.result.data.grossAmount)
            .replace('%GAMOUNT%', responseData.result.data.grossAmount)
            .replace('%NETTOTAL%', responseData.result.data.netAmount)

        // Assuming your public directory is '/var/www/html' or similar
        const publicDir = './public';

        // Assuming 'invoices' directory is directly under the public directory
        const pdfRelativePath = '/invoices/buyInvoice/invoice.pdf';
        const pdfPath = path.join(publicDir, pdfRelativePath);
        console.log('pdfPath', pdfPath);


        // const pdfPath = path.resolve(__dirname, '../../public/invoices/buyInvoice/invoice.pdf'); // Path to public folder
        // const pdfPath = path.resolve(__dirname, '../../invoices/buyInvoice/invoice.pdf'); // Path to public folder

        console.log('pdfPath', pdfPath);

        pdf.create(filledTemplate, { format: 'A4', type: 'pdf', orientation: 'portrait', width: '15in' }).toFile(pdfPath, (err, pdfRes) => {
            if (err) {
                console.error('Error creating PDF:', err);
                return res.status(500).json({
                    error: true,
                    message: 'Error generating PDF',
                    data: []
                });
            } else {
                console.log('PDF created successfully:', pdfRes.filename);

                const responseDataString = JSON.stringify(responseData, null, 2);
                const filePath = 'response_data.json';

                fs.writeFileSync(filePath, responseDataString);
                console.log('Response data saved to file:', filePath);

                // Now, construct the relative URL for the client to access the PDF
                const relativeUrl = '/augmont' + pdfRelativePath; // Adjust '/augmont' based on your server setup

                return res.status(200).json({
                    error: false,
                    message: 'success',
                    data: [
                        response.data,
                        { invoice: relativeUrl }
                    ]
                });
            }
        });


    } catch (error) {
        console.error('Error:', error);
        return res.status(400).json({
            error: true,
            message: error.message || 'Internal server error',
            data: []
        });
    }
};





const redeemInvoice = async (req, res) => {

    const customerRefNo = req.user._id.toString();
    const { transactionID } = req.params;

    const user = await userAugmontModel.findOne({ customerRefNo }).sort({ _id: -1 });
    const token = await tokenAugmontModel.findOne().sort({ _id: -1 });


    try {

        const response = await axios.get(`${process.env.Augmont_URL}/merchant/v1/invoice/order/${transactionID}`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token.token_augmont}`
            }
        })

        // Check if response is undefined
        if (!response || !response.data) {
            throw new Error('Empty response or missing response data');
        }

        const responseData = response.data;

        const htmlContent = fs.readFileSync(path.resolve(__dirname, '../../views/redeem_invoice.html'), 'utf-8');
        filledTemplate = htmlContent
            // .replace('%INVOICENUMBER%', responseData.result.data.invoiceNumber)
            .replace('%TRANSACTIONID%', responseData.result.data.transactionId)
            .replace('%NAME%', responseData.result.data.userInfo.name)
            .replace('%ADDRESS%', responseData.result.data.userInfo.address ? responseData.result.data.userInfo.address : '')
            .replace('%CITY%', responseData.result.data.userInfo.city ? responseData.result.data.userInfo.city : '')
            .replace('%STATE%', responseData.result.data.userInfo.state)
            .replace('%PINCODE%', responseData.result.data.userInfo.pincode ? responseData.result.data.userInfo.pincode : '')
            .replace('%MOBILE%', responseData.result.data.userInfo.mobileNumber ? responseData.result.data.userInfo.mobileNumber : '')
            .replace('%EMAIL%', responseData.result.data.userInfo.email ? responseData.result.data.userInfo.email : "")
            .replace('%UNIQUEID%', responseData.result.data.userInfo.uniqueId)
            // .replace('%HSNCODE%', responseData.result.data.hsnCode)
            .replace('%QUANTITY%', responseData.result.data.quantity)
            .replace('%QUANTITY1%', responseData.result.data.quantity)
            .replace('%RATE%', responseData.result.data.rate)
            // .replace('%CGSTTAXPERCENT%', responseData.result.data.taxes.taxSplit[0].taxPerc)
            // .replace('%CGSTTAXAMOUNT%', responseData.result.data.taxes.taxSplit[0].taxAmount)
            // .replace('%SGSTTAXAMOUNT%', responseData.result.data.taxes.taxSplit[1].taxAmount)
            // .replace('%SGSTTAXPERCENT%', responseData.result.data.taxes.taxSplit[1].taxPerc)
            // .replace('%IGSTTAXPERCENT%', responseData.result.data.taxes.taxSplit[1].taxPerc)
            // .replace('%IGSTTAXAMOUNT%', responseData.result.data.taxes.taxSplit[1].taxAmount)
            .replace('%GROSSAMOUNT%', responseData.result.data.grossAmount)
            .replace('%GAMOUNT%', responseData.result.data.grossAmount)
            .replace('%NETTOTAL%', responseData.result.data.netAmount)
            .replace('%SELLDATE%', responseData.result.data.sellTransactionDate)

        // const DBresponse = await redeemInvoiceModel.create({ ...response.data });
        // console.log("DBresponse", DBresponse);
        const pdfPath = path.resolve(__dirname, '../../public/invoices/redeemInvoice/invoice.pdf'); // Path to public folder

        console.log('pdfPath', pdfPath);

        pdf.create(filledTemplate, { format: 'A4', "type": "pdf", "orientation": "portrait", "width": "15in" }).toFile(pdfPath, (err, pdfRes) => {

            if (err) {
                console.error('Error creating PDF:', err);
                return res.status(500).json({
                    error: true,
                    message: 'Error generating PDF',
                    data: []
                });
            } else {
                console.log('PDF created successfully:', pdfRes.filename);

                // Further actions after PDF creation
                const responseDataString = JSON.stringify(responseData, null, 2);
                const filePath = 'response_data.json';

                fs.writeFileSync(filePath, responseDataString);
                console.log('Response data saved to file:', filePath);

                // const DBresponse = buyInvoiceModel.create({ ...responseData });
                // console.log("DBresponse", DBresponse);

                return res.status(200).json({
                    error: false,
                    message: 'success',
                    data: [response.data,
                    {
                        "invoice": pdfPath
                    }


                    ] // Return PDF path relative to public folder
                });
            }
        });


    } catch (error) {
        console.log("error", error.response.data);

        return res.status(400).json({
            error: true,
            statusCode: error.response.data.statusCode,
            message: error.response.data.message,
            data: []
        })
    }
}

const sellInvoice = async (req, res) => {
    const customerRefNo = req.user._id.toString();
    const { transactionID } = req.params;

    const user = await userAugmontModel.findOne({ customerRefNo }).sort({ _id: -1 });
    const token = await tokenAugmontModel.findOne().sort({ _id: -1 });

    try {

        const response = await axios.get(`${process.env.Augmont_URL}/merchant/v1/invoice/sell/${transactionID}`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token.token_augmont}`
            }
        })

        // Check if response is undefined
        if (!response || !response.data) {
            throw new Error('Empty response or missing response data');
        }

        const responseData = response.data;

        const htmlContent = fs.readFileSync(path.resolve(__dirname, '../../views/sell_invoice.html'), 'utf-8');
        filledTemplate = htmlContent
            // .replace('%INVOICENUMBER%', responseData.result.data.invoiceNumber)
            .replace('%TRANSACTIONID%', responseData.result.data.transactionId)
            .replace('%NAME%', responseData.result.data.userInfo.name)
            .replace('%ADDRESS%', responseData.result.data.userInfo.address ? responseData.result.data.userInfo.address : '')
            .replace('%CITY%', responseData.result.data.userInfo.city ? responseData.result.data.userInfo.city : '')
            .replace('%STATE%', responseData.result.data.userInfo.state)
            .replace('%PINCODE%', responseData.result.data.userInfo.pincode ? responseData.result.data.userInfo.pincode : '')
            .replace('%MOBILE%', responseData.result.data.userInfo.mobileNumber ? responseData.result.data.userInfo.mobileNumber : '')
            .replace('%EMAIL%', responseData.result.data.userInfo.email ? responseData.result.data.userInfo.email : "")
            .replace('%UNIQUEID%', responseData.result.data.userInfo.uniqueId)
            // .replace('%HSNCODE%', responseData.result.data.hsnCode)
            .replace('%QUANTITY%', responseData.result.data.quantity)
            .replace('%QUANTITY1%', responseData.result.data.quantity)
            .replace('%RATE%', responseData.result.data.rate)
            // .replace('%CGSTTAXPERCENT%', responseData.result.data.taxes.taxSplit[0].taxPerc)
            // .replace('%CGSTTAXAMOUNT%', responseData.result.data.taxes.taxSplit[0].taxAmount)
            // .replace('%SGSTTAXAMOUNT%', responseData.result.data.taxes.taxSplit[1].taxAmount)
            // .replace('%SGSTTAXPERCENT%', responseData.result.data.taxes.taxSplit[1].taxPerc)
            // .replace('%IGSTTAXPERCENT%', responseData.result.data.taxes.taxSplit[1].taxPerc)
            // .replace('%IGSTTAXAMOUNT%', responseData.result.data.taxes.taxSplit[1].taxAmount)
            .replace('%GROSSAMOUNT%', responseData.result.data.grossAmount)
            .replace('%GAMOUNT%', responseData.result.data.grossAmount)
            .replace('%NETTOTAL%', responseData.result.data.netAmount)
            .replace('%SELLDATE%', responseData.result.data.sellTransactionDate)


        // const DBresponse = await sellInvoiceModel.create({ ...response.data });
        // console.log("DBresponse", DBresponse);

        const pdfPath = path.resolve(__dirname, '../../public/invoices/sellInvoice/sell_invoice.pdf'); // Path to public folder

        console.log('pdfPath', pdfPath);

        pdf.create(filledTemplate, { format: 'A4', "type": "pdf", "orientation": "portrait", "width": "15in" }).toFile(pdfPath, (err, pdfRes) => {

            if (err) {
                console.error('Error creating PDF:', err);
                return res.status(500).json({
                    error: true,
                    message: 'Error generating PDF',
                    data: []
                });
            } else {
                console.log('PDF created successfully:', pdfRes.filename);

                // Further actions after PDF creation
                const responseDataString = JSON.stringify(responseData, null, 2);
                const filePath = 'response_data.json';

                fs.writeFileSync(filePath, responseDataString);
                console.log('Response data saved to file:', filePath);

                // const DBresponse = buyInvoiceModel.create({ ...responseData });
                // console.log("DBresponse", DBresponse);

                return res.status(200).json({
                    error: false,
                    message: 'success',
                    data: [response.data,
                    {
                        "invoice": pdfPath
                    }


                    ] // Return PDF path relative to public folder
                });
            }
        });


    } catch (error) {
        console.log("error", error.response.data);

        return res.status(400).json({
            error: true,
            statusCode: error.response.data.statusCode,
            message: error.response.data.message,
            data: []
        })
    }
}


module.exports = {
    buyInvoice,
    redeemInvoice,
    sellInvoice
}