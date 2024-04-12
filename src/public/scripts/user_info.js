/************************************************************************
Project: Software Programming Quiz
Purpose: Support for quiz db actions
Author: Li, Feng, Tauiliili
Created: 2024-02-24
Last Updated: 2024-02-24
************************************************************************/
const db = require('./database');
const moment = require('moment');

async function get_user_by_username(username, ctxt) {
    // check the input fields are not empty
    if (username) {
        let conn, query;
        try {
            query = 'SELECT acc.user_name, p.profile_name, p.email FROM Accounts acc \
                LEFT JOIN Profiles p ON acc.account_id=p.account_id WHERE LOWER(acc.user_name)=?';
            conn = await db.getConnection();

            let acc = await conn.query(query, [username.toLowerCase()]);
            console.log(acc);

            if (acc.length == 1) {
                ctxt.account_details = acc[0];
                ctxt.error = false;
            } else {
                ctxt.error = true;
                ctxt.errorMessage = (acc.length > 1) ? `Multiple accounts found for user ${username}` :
                    `There was an error retrieving the account details from the database for user ${username}.`
                console.log(ctxt.errorMessage);
            }
        } catch (err) {
            console.log(conn);
            throw err;
        }
        finally {
            if (conn) conn.end(err => {
                if (err) {
                    console.log("SQL error in closing connection: ", err);
                }
            });
        }
    }

    return ctxt;
};


module.exports = { get_user_by_username };