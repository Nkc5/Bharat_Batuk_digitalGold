


const { merchantBuyList } = require('./get-buy-info.controller.js');
const { merchanSellList } = require('./sell_augmont.js');
const { list } = require('./Get_Order_List.controller.js');



const History = async (req, res) => {
    try {
        console.log("Fetching history data...");

        const buyResponse = await merchantBuyList(req, res);
        const sellResponse = await merchanSellList(req, res);
        const reedemResponse = await list(req, res);

        console.log("buyResponse", buyResponse);
        console.log("sellResponse", sellResponse);
        console.log("ReedemResponse", reedemResponse);

      


        return [...buyResponse.result.data,...sellResponse.result.data,...reedemResponse.result.data]


    } catch (error) {
        console.error("Error:", error);
        throw error; // Rethrow the error for the calling function to handle
    }
};

module.exports = {
    History
};

