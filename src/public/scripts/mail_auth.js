/************************************************************************
Project: Software Programming Quiz
Purpose: Oauth token for gmail account
Author: Li, Feng, Tauiliili
Last Updated: 2024-03-05
************************************************************************/

const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
    }
});

module.exports = {transporter};
