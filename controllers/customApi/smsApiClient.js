const http = require('http');
const querystring = require('querystring');
const userModel = require("../../models/user.models.js");


class SmsApiClient {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    sendSingleSms(userId, password, senderId, phoneNumber, message, entityId, templateId) {
        // const encodedMessage = encodeURIComponent(message);
        // const encodedPassword = encodeURIComponent(password);
    
        const params = {
            UserID: userId,
            Password: password,
            SenderID: senderId,
            Phno: phoneNumber,
            Msg: message,
            EntityID: entityId,
            TemplateID: templateId
        };

        console.log("params", params);

        const url = `${this.baseUrl}?${querystring.stringify(params)}`;

        console.log("url", url);

        
        return new Promise((resolve, reject) => {
            http.get(url, (response) => {
                let data = '';

                response.on('data', (chunk) => {
                    data += chunk;
                });

                response.on('end', () => {
                    resolve(data);
                });
            }).on('error', (error) => {
                reject(`Error: ${error.message}`);
            });
        });
    }


}

module.exports = SmsApiClient;
