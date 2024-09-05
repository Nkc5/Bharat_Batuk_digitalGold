
const axios = require('axios');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const { format } = require('date-fns');
const { response } = require('express');
const userModel = require('../../models/user.models.js');








async function api(req, res) {
    //http://13.201.77.26:1337/p2p/GetTransactionByExtTxnId?TransactionId=1706859744&InvestorId=2671459

    const { TransactionId, InvestorId } = req.query;
    console.log("req.query", req.query)

    try {
        if (req.session.response) {
            const result = req.session.response;
            req.session.response = null;
            console.log("result", result)

            return res.render('p2p.ejs', {
                result
            })

        }
        req.session.customObject = { transaction_id: TransactionId, investor_id: InvestorId };
        return api(req, res);
    }
    catch (error) {
        return console.log(error);
    }
}


async function IsInvestorExist(req, res) {
    //http://13.233.194.174:1337/p2p/GetTransactionByExtTxnId?TransactionId=1706859744&InvestorId=2671459
    
    const customerRefNo = req.user._id.toString()
    // const {TransactionId, InvestorId} = req.query;
    const user = await userModel.findOne({ _id: customerRefNo })
    console.log("user", user)
    console.log("cust", customerRefNo)
    // const {email,pan_number,mobile_number}=req.body;
    // const data=req.body;
    // console.log("Data", data)
    const currentDate = new Date();
    const formattedDate = format(currentDate, 'yyyy-MM-dd HH:mm:ss');
    console.log("first", formattedDate)
    if (!user.pan_number || !user.phone || !user.email) {
        console.log("Mandatory Parameter missing")
        return;
    }
    try {
        const Checksum = createChecksum(user.pan_number, user.phone, user.email, formattedDate)
        console.log("check", Checksum)
        const data = {
            "email": user.email,
            "pan_number": user.pan_number,
            "mobile_number": user.phone,

            // "investor_id":Number(investor_id),
            "timestamp": formattedDate,
            "checksum": Checksum,
            "mid": "M004914"
        }
        console.log("first")
        const response = await axios.post('https://sup-integration-stage.liquiloan.in/api/v2/IsInvestorExist', data)

        console.log("in investorexist", response.data)
        //  return response.data;

        if (response.data.data[0].investor_id) {
            console.log("in dash")

            return await dashboard(response.data.data[0].investor_id, req, res)
        }
        else {
            return response.data;
        }


    } catch (error) {
        return error;

    }
}




async function dashboard(investor_id, req, res) {

    //     //http://13.233.194.174:1337/p2p/GetTransactionByExtTxnId?TransactionId=1706859744&InvestorId=2671459

    //     // const {TransactionId, InvestorId} = req.query;
    // const {InvestorId,Timestamp}=req.body;

    const currentDate = new Date();
    const formattedDate = format(currentDate, 'yyyy-MM-dd HH:mm:ss');


    try {
        const Checksum = createChecksum1(investor_id, formattedDate)
        console.log("first", Checksum)
        const data = {
            "investor_id": Number(investor_id),
            "timestamp": formattedDate,
            "checksum": Checksum,
            "mid": "M004914"
        }
        console.log("Data", data)
        const response = await axios.post('https://sup-integration-stage.liquiloan.in/api/v2/GetInvestmentSummary', data)
        console.log("in dashboard", response.data)
        return response.data


    } catch (error) {
        return error;

    }
}



function createChecksum1(InvestorId, Timestamp) {

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




// try {
// if( req.session.response){
//     const result = req.session.response;
//     req.session.response = null;
//     console.log("result", result)

// return res.render('p2p.ejs', {
//     result
// })

// }
// req.session.customObject = {transaction_id: TransactionId, investor_id: InvestorId};
// return api (req, res);
//     }
//     catch (error) {
//        return console.log(error);
//     }
// }




async function GetTransactionByExtTxnId(req, res) {
    //http://13.201.77.26:1337/p2p/GetTransactionByExtTxnId?id=TransactionId&InvestorId


// http://13.201.77.26:1337/p2p/GetTransactionByExtTxnId?id=TransactionID_InvestorID


    const {id} = req.query;
    console.log("req.query", req.query)

    const splitQuery = id.split('_')
    console.log("splitQuery", splitQuery);
    const transaction_id = splitQuery[0];
    const investor_id = splitQuery[1];
    console.log("transaction_id", transaction_id)
    console.log("investor_id", investor_id)



    const currentDate = new Date();
    const formattedDate = format(currentDate, 'yyyy-MM-dd HH:mm:ss');

    const data = {

        "mid": "M004914",
        "checksum": await createChecksum("Credit", transaction_id, investor_id, formattedDate),
        "timestamp": formattedDate,
        "transaction_type": "Credit",
        "transaction_id": transaction_id,
        "investor_id": Number(investor_id),
    }

    console.log("data", data)


    const response = await axios.post('https://sup-integration-stage.liquiloan.in/api/v2/GetTransactionByExtTxnId', data, {
        headers: {
            'Content-Type': 'application/json'
        }
    })

// console.log("response.data", response.data)
console.log("response.data", response)
console.log("response.data.data.approval_status", response.data.data[0].approval_status)


switch (response.data.data[0].transaction_status) {
    case 'Progress':
        return res.render('p2p.ejs', {
            result: 'Progress'
        })


    case 'Pending':
        return res.render('p2p.ejs', {
            result: 'Pending'
        })

    case 'Rejected':
        return res.render('p2p.ejs', {
            result: 'Rejected'
        })

    case 'Approved':
        return res.render('p2p.ejs', {
            result: 'Approved'
        })

    case 'Executed':
        return res.render('p2p.ejs', {
            result: 'Executed'
        })

    case 'Banking':
        return res.render('p2p.ejs', {
            result: 'Banking'
        })

    case 'Failed':
        return res.render('p2p.ejs', {
            result: 'Failed'
        })

    case 'Processed':
        return res.render('p2p.ejs', {
            result: 'Processed'
        })

}



}




async function createChecksum(transactionType, transactionId, investorId, timestamp) {

    const key = "DD9C6CE9D86C3";

    // Concatenate the values with '||' separator
    const concatenatedString = `${transactionType.trim()}||${transactionId.trim()}||${Number(investorId)}||${timestamp.trim()}`;

    // Create an HMAC (Hash-based Message Authentication Code) using the SHA-256 algorithm
    const hmac = crypto.createHmac('sha256', key);


    // Update the HMAC object with the concatenated string
    hmac.update(concatenatedString);


    // Get the hexadecimal representation of the HMAC
    const checksum = hmac.digest('hex');


    return checksum;
}



module.exports = {
    GetTransactionByExtTxnId,
    IsInvestorExist,
    api,
    dashboard
}