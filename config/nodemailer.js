const nodemailer = require("nodemailer");

// create reusable transporter object using the default SMTP transport
let EmailService = nodemailer.createTransport({
    service: 'gmail',
    user: 'smpt.gmail.com',
    port: 465,
    secure: true,
    auth: {
        type: 'Login',
        user: 'tech@siano.in', // email
        pass: 'xxxxxxxx', // password
    },
});

module.exports = EmailService;