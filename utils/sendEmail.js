const nodemailer = require("nodemailer")

const sendEmail = async (options)=> {

    // create transporter service to send emails using gmail
    const transport = nodemailer.createTransport({
        host:process.env.NODEMAILER_HOST,
        port:process.env.NODEMAILER_PORT,
        secure: true,
        auth: {
            user: process.env.NODEMAILER_USER,
            pass: process.env.NODEMAILER_PASS,
        }
    })
    
    // email data
    const mailOptions = {
        from: 'Nova-shop <mahmoudhussein0049@gmail.com>',
        to: options.email,
        subject: options.subject,
        html: options.message
    }

// send email
await transport.sendMail(mailOptions)

}

module.exports = sendEmail

