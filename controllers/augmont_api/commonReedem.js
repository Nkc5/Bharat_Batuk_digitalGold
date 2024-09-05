
const tradeMmtc = require('../mmtcApi/trade.controller.js');
const { augmontReedem } = require('./post_order.controller.js');
const {addressAugmontCommon} = require('./address_augmont.js');
const userMMtc = require('../mmtcApi/user.controller.js')
const addressModel = require('../../models/address.models.js')
const crypto = require('crypto')






module.exports =  commmonReedem = async (req, res) => {

    const customerRefNo = req.user._id.toString();
    const { company, _id, product1, quantity1, totalAmount, preTaxAmount, taxAmount, productId, quantity, makingCharge, skuId, billingAddressId } = req.body;

    const addressResponse = await addressModel.findOne({_id });

    if (company === "mmtc") {

        try {

            if (!addressResponse.id) {
                const addAddressToMMtc = await userMMtc.addUpdateAddressMMTC({ customerRefNo, name, mobileNumber, country, state, city, line1, line2= addressResponse.line2 ? addressResponse.line2 : "", zip, statecode, type=addressResponse.type ? 'D' : 'D' } = addressResponse)

                console.log("addAddressToMMtc", addAddressToMMtc);
                addressResponse.id = addAddressToMMtc.id;
                addressResponse.mmtc_customer_ref = addAddressToMMtc.customerRefNo;
                await addressResponse.save();

            }

            console.log("addressResponse", addressResponse)

            const productList = [{ productId, quantity, makingCharge, skuId }]

            var response = await tradeMmtc.validateRedeemMMTC(req, res, { customerRefNo, transactionRefNo: crypto.randomUUID(), productList: productList, billingAddressId, shippingAddressId:addressResponse.id, totalAmount, preTaxAmount, taxAmount });
            console.log("mmtcReedemResponse", response);

            return res.status(200).json({
                error: false,
                message: 'success',
                data: [response]
            })

        } catch (error) {
            console.log("error", error);
            return res.status(400).json({
                error: true,
                message: error.message,
                data: []
            })
        }

    }
    else {

        try {
            if (!addressResponse.userAddressId) {
                const response = await addressAugmontCommon(customerRefNo, req.user.name, req.user.phone, addressResponse.zip, addressResponse.line1, addressResponse.line2 ? addressResponse.line2 : null);
                addressResponse.userAddressId = response.result.data.userAddressId;
                addressResponse.userAccountId = response.result.data.userAccountId;
                await addressResponse.save();

            }
            console.log("addressResponse", addressResponse);
            var response = await augmontReedem(customerRefNo, req.user.phone, addressResponse.userAddressId, product1, quantity1);

            console.log("response", response);

            return res.status(200).json({
                error: false,
                message: 'success',
                data: [response]
            })


        } catch (error) {
            console.log("error", error);
            return res.status(400).json({
                error: true,
                message: error.message,
                data: []
            })
        }

    }
}