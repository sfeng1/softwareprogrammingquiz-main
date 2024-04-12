/************************************************************************
Project: Software Programming Quiz
Purpose: Create new account
Author: Li, Feng, Tauiliili
Last Updated: 2024-03-05
************************************************************************/
var db_pool = require('./database');

async function make_acct(requ, resp) {
	let username = requ.body.username.toLowerCase();
	let password = requ.body.password;
    let acctmail = requ.body.acctmail.toLowerCase();
    let acctstate = requ.body.acctstate;
    let acctques = requ.body.acctques;
    let acctans = requ.body.acctans;
    let insert_id;

    // process empty account name if needed 
    let acctname = requ.body.acctname;
    if (acctname == null || acctname == "") {
        acctname = 'NULL'
    };

	// check the input fields are not empty
	if (username && password) {
    
        // see if username already exists
        var login_connect = await db_pool.getConnection()
        .catch((error) => {
            console.log(error)
            resp.send(error);
        });

        var login_result = await login_connect.query('SELECT * FROM Accounts WHERE user_name = ?', [username])
        .catch((error) => {
            console.log(error)
            resp.send(error);
            login_connect.release();
         });

        login_connect.release();

        // see if email already exists
        var email_connect = await db_pool.getConnection()
        .catch((error) => {
            console.log(error)
            resp.send(error);
        });

        var email_result = await email_connect.query('SELECT * FROM Profiles WHERE email = ?', [acctmail])
        .catch((error) => {
            console.log(error)
            resp.send(error);
            login_connect.release();
            });

        email_connect.release();

        // if EITHER username or email already exists, throw error since those fields must be unique
        if(login_result.length == 1 || email_result.length == 1 ) {
            if (login_result.length == 1) {
            // username is not unique
            var string = encodeURIComponent('username');
            resp.redirect('/create_account?error=' + string);
            } else {
                // email is not unique 
                var string = encodeURIComponent('email');
                resp.redirect('/create_account?error=' + string);
            };
        } else {
            // create account with new connection
            var account_conn = await db_pool.getConnection();
            try {
                await account_conn.beginTransaction();
                insert_id = await account_conn.query('INSERT INTO Accounts (user_name, password) VALUES (?, ?)',[username, password]);
                insert_id = (insert_id.insertId).toString();
                await account_conn.commit();
            } finally {
                account_conn.release();
            };
            
            // create profile with new connection
            var profile_conn = await db_pool.getConnection();
                try {
                    await profile_conn.beginTransaction();
                    await profile_conn.query('INSERT INTO Profiles (profile_name, email, state, account_id, sec_question, sec_answer) VALUES (?, ?, ?, ?, ?, ?)',[acctname, acctmail, acctstate, insert_id, acctques, acctans]);
                    await profile_conn.commit();
                } finally {
                    profile_conn.release();
                };

            resp.redirect('/login');
      };
    } else {
      var string = encodeURIComponent('fill');
      resp.redirect('/create_account?error=' + string);
    }
    resp.end();
};

module.exports = {make_acct};

