/************************************************************************
Project: Software Programming Quiz
Purpose: Update profile table based on input
Author: Li, Feng, Tauiliili
Last Updated: 2024-03-05
************************************************************************/
var db_pool = require('./database');

async function profile_update(requ, resp) {
    let account = requ.session.username.toLowerCase(); 
	let acctname = requ.body.acctname;
	let password = requ.body.password;
    let acctmail = requ.body.acctmail.toLowerCase();
    let acctstate = requ.body.acctstate;
    let insert_id 

    // if all fields are filled
    if (account && acctname && password && acctmail && acctstate) {

        // update user_name 
        var profile_conn = await db_pool.getConnection();
        try {
            await profile_conn.beginTransaction();
            await profile_conn.query('UPDATE Accounts SET password = ? WHERE user_name = ?',[password, account]);
            await profile_conn.commit();
        } finally {
            profile_conn.release();
        };

        // update profile
        var profile_conn = await db_pool.getConnection();
        try {
            await profile_conn.beginTransaction();
            insert_id = await profile_conn.query('SELECT account_id FROM Accounts WHERE user_name = ?',[account]);
            insert_id = (insert_id[0].account_id).toString(); 
            await profile_conn.query('UPDATE Profiles SET profile_name = ?, email = ?, state = ? WHERE account_id = ?',[acctname, acctmail, acctstate, insert_id]);
            await profile_conn.commit();
        } finally {
            profile_conn.release();
        };

    resp.redirect('/profile');

    } else {
        // if all fields are not present 
        var string = encodeURIComponent('fill');
        resp.redirect('/profile_edit?error=' + string);
    }	
};

module.exports = {profile_update};