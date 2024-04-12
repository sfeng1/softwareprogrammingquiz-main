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
      clientSecret: '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',
      refreshToken: '1//044zPIDIXlzMlCgYIARAAGAQSNwF-L9IrjIyoD0uJ5QxNUfOSNI3AQfgrABuditC92f0lplKJ-BGcmVcmkX5ghvZ0tYOJEUvH7LU'
    }
});

module.exports = {transporter};
