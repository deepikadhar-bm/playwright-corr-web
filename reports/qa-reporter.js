require("dotenv").config();
const path = require("path");
 
const sendEmail = require(path.join(__dirname, "./send-email"));
 
class QAReporter {
    /**
       @param {import('@playwright/test/reporter').FullResult} result
    */
    async onEnd(result) {
 
        try {
            const autoSendEmail = process.env.AUTO_SEND_EMAIL === "true";
 
            // console.log(
            //     `Email Mode: ${autoSendEmail
            //         ? "AUTO — ZIP will be created and email will be sent"
            //         : "MANUAL — ZIP created. Run: node utils/send-email.js to send manually"
            //     }`
            // );
 
            await sendEmail(autoSendEmail);
 
        } catch (error) {
            console.error("Error Message: ", error.message || error);
        }
    }
}
 
module.exports = QAReporter;