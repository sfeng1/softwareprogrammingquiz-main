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
      type: 'OAuth2',
      user: 'softwareprogrammingquiz2024@gmail.com',
      pass: 'CS467spq2024',
      clientId: '684146792452-7m59l3iasil6jbqsg3eluat3schqnfhi.apps.googleusercontent.com',
      clientSecret: ,
      refreshToken: 
    }
});

module.exports = {transporter};
