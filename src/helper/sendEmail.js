const {JWTEMPLOYE,JWTRECRUITER,JWT_REGIS,EMAIL,PASSWORD} = require('../helper/env')
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken')
const {URL_LOKAL} = require('../helper/env')
module.exports = {
  sendEmailEmploye: (email) => {
    const isjwt = jwt.sign({ email: email }, JWTEMPLOYE);
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: EMAIL,
        pass: PASSWORD,
      },
    });
    const link = `${URL_LOKAL}/employe/register/${isjwt}`;
    var mailOptions = {
      from: "as@gmail.com",
      to: email,
      subject: "Register hire app",
      html:
        "Hello,<br> <h2>Please Click on the link to verify your email.</h2><br><a href=" +
        link +
        ">Click here to verify</a>",
    };
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) throw err;
      console.log("Email sent: " + info.response);
    });
    
  },
  sendEmailRecruiter: (email,id) => {
    const token = jwt.sign({ email: email,id:id}, JWTRECRUITER)

    const output = `
          <center><h3>Hello ${email}</h3>
          <h3>Thank you for registration</h3>
          <p>You can confirm your email by clicking the link below <br> <a href="${URL_LOKAL}/hire/recruiter/verify/${token}">Activation</a></p></center>
    `

    let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: '587',
      secure: false,
      requireTLS: true,
      auth: {
        user: EMAIL,
        pass: PASSWORD
      }
    })

    let Mail = {
      from: '"Peworld" <peworld@peworld.com>',
      to: email,
      subject: "Verification Email",
      text: "Plaintext version of the message",
      html: output
    }

    transporter.sendMail(Mail, (err, info) => {
      if (err) throw err
      console.log("Email sent: " + info.response)
    })
  },

  sendEmailForgotRecruiter: (email, userkey) => {
    const output = `
          <center><h3>Hello ${email}</h3>
          <p>You can reset your password by clicking the link below <br> <a href="http://localhost:8080/forgot?key=${userkey}">Reset Password</a></p></center>
    `

    let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: '587',
      secure: false,
      requireTLS: true,
      auth: {
        user: EMAIL,
        pass: PASSWORD
      }
    })

    let Mail = {
      from: '"Peworld" <peworld@peworld.com>',
      to: email,
      subject: "Reset Password",
      text: "Plaintext version of the message",
      html: output
    }

    transporter.sendMail(Mail)
  },

  sendEmailForgotEmploye: (email, userkey) => {
    const output = `
          <center><h3>Hello ${email}</h3>
          <p>You can reset your password by clicking the link below <br> <a href="http://localhost:8080/forgot-employe?key=${userkey}">Reset Password</a></p></center>
    `

    let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: '587',
      secure: false,
      requireTLS: true,
      auth: {
        user: EMAIL,
        pass: PASSWORD
      }
    })

    let Mail = {
      from: '"Peworld" <peworld@peworld.com>',
      to: email,
      subject: "Reset Password",
      text: "Plaintext version of the message",
      html: output
    }

    transporter.sendMail(Mail)
  }
}
