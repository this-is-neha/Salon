require('dotenv').config()
const nodemailer = require('nodemailer')
class MailService{
    transport;
    constructor() {
        try {
            this.transport = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: process.env.SMTP_PORT,
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASSWORD,

                }
            })
        }
        catch (exception) {
            console.log(exception)
            throw new Error("Error connnecting email Services")
        }
    }

    sendEmail = async (to, subject, message, attachments = null) => {
        try {
            const mailStatus = await this.transport.sendMail({
                to: to,
                from: process.env.SMTP_FROM,
                subject: subject,
                html: message,
                attachments: attachments
            })
            console.log(mailStatus)
            return mailStatus
        }
        catch (expextion) {
            throw new Error("Error sending email")
        }
    }

}
const mailSvc = new MailService()
module.exports = mailSvc
