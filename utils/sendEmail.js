const nodemailer = require("nodemailer");
const sendeEmail = async (options) => {
  const sendOpt = {
    service: 'qq',
    auth: {
      user: process.env.SMTP_EMAIL, // generated ethereal user
      pass: process.env.SMTP_PASSWORD, // generated ethereal password
    }, 
  }
  let transporter = nodemailer.createTransport(sendOpt)
  let info = await transporter.sendMail({
    from: `${process.env.FROM_NAME} <${process.env.SMTP_EMAIL}>`, // sender address
    to: options.email, // list of receivers
    subject: options.subject, // Subject line
    text: options.message, // plain text body
  });
  console.log("Message sent: %s", info.messageId);
}
module.exports = sendeEmail