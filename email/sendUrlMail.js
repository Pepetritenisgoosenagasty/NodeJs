"use strict";
const nodemailer = require("nodemailer");

const sendResetPasswordMail = ({email, subject, url}) => {
  // async..await is not allowed in global scope, must use a wrapper
async function main() {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();
   // create reusable transporter object using the default SMTP transport
   let transporter = nodemailer.createTransport({
    host: `${process.env.NODEMAILER_HOST}`,
    port: process.env.NODEMAILER_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: `${process.env.NODEMAILER_AUTH_EMAIL}`, // generated ethereal user
      pass: `${process.env.NODEMAILER_AUTH_PASSWORD}`, // generated ethereal password
    },
  });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"Fred Mern auth 👻" <hulkshare@gmail.com>', // sender address
      to: email, // list of receivers
      subject: `${subject}`, // Subject line
      text: `Click on this link to reset your password ${url}`, // plain text body
      html: "<b>Click on this link to reset your password ${url}`</b>", // html body
    });
  
    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  
    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  }
  
  main().catch(console.error);
}

const verifyMail = ({email, name, url, token}) => {
  // async..await is not allowed in global scope, must use a wrapper
async function main() {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  // let testAccount = await nodemailer.createTestAccount();
   // create reusable transporter object using the default SMTP transport
   let transporter = nodemailer.createTransport({
    host: `${process.env.NODEMAILER_HOST}`,
    port: process.env.NODEMAILER_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "monogasppar@gmail.com", // generated ethereal user
      pass: `${process.env.NODEMAILER_AUTH_PASSWORD}`, // generated ethereal password
    },
  });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"Fred Mern auth 👻" <hulkshare@gmail.com>', // sender address
      to: email, // list of receivers
      subject: `Mern Auth - Verify youtr email`, // Subject line
      // text: `Click on this link to reset your password ${url}`, // plain text body
      html: `<h2>${name}! Thanks for registering on our site</h2>
              <h4> Please verify your email to continue...</h4>
              <a href="http://${url}/api/verify-email?token=${token}">Verify Your Email</a>`, // html body
    });
  
    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  
    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  }
  
  main().catch(console.error);
}

module.exports = {
  sendResetPasswordMail,
  verifyMail
}