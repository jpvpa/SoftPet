const nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: 'softpet.store@gmail.com', // generated ethereal user
      pass: 'softpet123' // generated ethereal password
    }
})

module.exports = transporter;