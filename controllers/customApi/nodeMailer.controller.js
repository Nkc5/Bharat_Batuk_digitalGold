const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path')
const userModel = require('../../models/user.models.js');

class NodeMailer {

    /*  for sending html page: only inline css or same page css   */

    static async toSendEmail(req, res, type, user, data) {

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'nitishk053@gmail.com',
                pass: 'ueor yjis kasd qunt',
            },
        });

        let endPoint;
        // let mailUser;



        if (type == "register") {
            endPoint = "register.html";
            // mailUser = user;
        }
        else if (type == "buy") {
            endPoint = "buy.html";
            // mailUser = user
        }

        else if (type == "sell") {
            endPoint = "sell.html"
            // mailUser = user

        }

        console.log("email", user.email)
        // reading html file through fs module
        const htmlContent = fs.readFileSync(path.resolve(__dirname, `../../views/${endPoint}`), 'utf-8');




        let replacedHtml, attachments, subject;

        if (type == "register") {
            replacedHtml = htmlContent
                .replace('Name', user.name)
            subject = "Welcome to Bharat Batuk - Registration Successful!"
            attachments = [];

        }

        if (type == "buy" || type == "sell") {
            replacedHtml = htmlContent
                .replace('%USERNAME%,', user.name)
                .replace('%AMOUNT%', data.quantity)
                .replace('%PRICE%', data.totalAmount)
                .replace('%DATE%', data.executionDateTime);

            type === "buy" ? subject = "Digital Gold Purchase Confirmation - Bharat Batuk" : subject = "Digital Gold Sale Confirmation - Bharat Batuk";


            // Attach the PDF to the email
            attachments = [{
                filename: `bharat_batuk_${type}.pdf`,
                path: `public/${data.invoicePDF}`
            }];


        }


        const mailOptions = {
            from: 'nitishk053@gmail.com',
            to: user.email,
            subject: subject,
            text: "",
            html: `${replacedHtml}`,
            attachments: attachments
        };

        try {

            transporter.sendMail(mailOptions, (error, info) => {

                if (!error) {
                    console.log('Email sent: ' + info.response);
                    return console.log('Email sent: ' + info.response);

                }

                return console.log(error);

            });
        }

        catch (error) {
            return console.log(error)

        }



    }


}


module.exports = NodeMailer;











