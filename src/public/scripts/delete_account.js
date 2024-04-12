/************************************************************************
Project: Software Programming Quiz
Purpose: Delete account
Author: Li, Feng, Tauiliili
Last Updated: 2024-03-05
************************************************************************/
const session = require('express-session');
var db_pool = require('./database');

async function profile_delete(requ, resp) {
    let username = requ.session.username 

    // if user is logged in 
    if (username) {

        // delete account
        var profile_conn = await db_pool.getConnection();
        try {
            await profile_conn.beginTransaction();
            await profile_conn.query('DELETE FROM Accounts WHERE user_name = ?',[username]);
            await profile_conn.commit();
        } finally {
            profile_conn.release();
        };

        //log user out 
        requ.session.destroy(resp.redirect('/'));

    resp.redirect('/');

    } else {
        // if all fields are not present 
        resp.redirect('/login');
    }	
};

module.exports = {profile_delete};