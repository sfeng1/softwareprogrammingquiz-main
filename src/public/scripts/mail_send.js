/************************************************************************
Project: Software Programming Quiz
Author: Li, Feng, Tauiliili
Created: 2024-02-17
Last Updated: 2024-02-24
Purpose: For dynamically building the quiz
************************************************************************/

const mail_conn = require('./mail_auth')
const db_pool = require('./database');
const MOMENT = require( 'moment' );

async function candidate_email(mail_addr, subject, key, text, html, ctxt) {
    // Email setup
    let mailOptions = {
        from: 'softwareprogrammingquiz2024@gmail.com',
        to: mail_addr,
        subject: subject,
        text: text,
        html: html
    };

    // Send Email 
    mail_conn.transporter.sendMail(mailOptions, function (err, data) {
        if (err) {
            console.log("Error " + err);
            ctxt.error = true;
            ctxt.errorMessage = `"Error sending candidate email: ${err}`;
        } else {
            console.log("Email sent successfully");
            // PST time currently
            var datetime = Date.now();
            datetime = MOMENT().format('YYYY-MM-DD  HH:mm:ss.000');
            // Update database
            db_update(key, datetime);
        }
    });

    async function db_update(key, datetime) {
        var connect = await db_pool.getConnection();
        try {
            await connect.beginTransaction();
            await connect.query('UPDATE Candidates SET email_sent_date = ? WHERE quiz_key = ?', [datetime, key]);
            await connect.commit();
        } finally {
            connect.release();
        }
    };

    return ctxt;
};


async function notification_email(mail_addr, subject, key, text, html, ctxt) {
    // Email parameters
    let mailOptions = {
        from: 'softwareprogrammingquiz2024@gmail.com',
        to: mail_addr,
        subject: subject,
        text: text,
        html: html
        };

    // Send Email 
    mail_conn.transporter.sendMail(mailOptions, function(err, data) {
    if (err) {
        console.log("Error " + err);
        ctxt.error = true;
        ctxt.errorMessage = `Error sending candidate assessment completion email: ${err}`
    } else {
        console.log("Email sent successfully");
        // PST time currently
        var datetime = Date.now();
        datetime = MOMENT().format( 'YYYY-MM-DD  HH:mm:ss.000' );
        // Update database
        db_update(key, datetime);
    }});
    
    async function db_update(key, datetime) {
    var connect = await db_pool.getConnection();
    try {
        await connect.beginTransaction();
        await connect.query('UPDATE Candidates SET email_complete_date = ? WHERE quiz_key = ?',[datetime, key]);
        await connect.commit();
    } finally {
        connect.release();
    }};

    return ctxt;
};

module.exports = {candidate_email, notification_email};
