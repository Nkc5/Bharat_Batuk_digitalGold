
const userMMtc = require('../mmtcApi/user.controller.js');
// const axios = require('axios');





class tradePrice{


    static async goldPrice(req, res){

        const{ timeFrame } = req.body;
        // console.log(req.body);
        const data = req.body;
        console.log("timeFrame", timeFrame)
        console.log("data", data)

        try{
            const response = await userMMtc.XAU(data, res);

            return res.json({
                "error": false,
                "message": "success",
                "data": response
            });

        }
        catch(err){
            return res.json({
            "error": true,
            "message": err,
            "data": null
        })
    }

    }

    
    static async silverPrice(req, res){

        const {timeFrame} = req.body;
        // console.log(req.body);
        const data = req.body;


        try{
            const response = await userMMtc.XAG(data, res);

            return res.json({
                "error": false,
                "message": "success",
                "data": response
            });

        }
        catch(err){
            return res.json({
            "error": true,
            "message": err,
            "data": null
        })
    }



    }


}

module.exports = tradePrice;