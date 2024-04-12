/************************************************************************
Project: Software Programming Quiz
Purpose: Verify username and password, then auth session
Author: Li, Feng, Tauiliili
Last Updated: 2024-03-05
************************************************************************/
var db_pool = require('./database');

async function verify_login(requ, resp) {
    let username = requ.body.username.toLowerCase();
    let password = requ.body.password;

    // check the input fields are not empty
    if (username && password) {

        // grab a connection from the pool
        var login_connect = await db_pool.getConnection()
            .catch((error) => {
                console.log(error);
                resp.end();
            });

        // query account from credentials
        var login_result = await login_connect.query('SELECT * FROM Accounts WHERE user_name = ? AND password = ?', [username, password])
            .catch((error) => {
                console.log(error);
                resp.end();
            });

        login_connect.release();

        // if account is found
        if (login_result.length > 0) {

            // auth session 
            requ.session.loggedin = true;
            requ.session.username = username;

            // if login was forced from locaton that is known
            if (requ.session?.previousurl)
                resp.redirect(requ.session.previousurl);
            else
                resp.redirect('/');

        } else {
            // if no account is found
            var string = encodeURIComponent('fail');
            resp.redirect('/login?error=' + string);
        }
    } else {
        var string = encodeURIComponent('fill');
        resp.redirect('/login?error=' + string);
    }
    resp.end();
};

module.exports = { verify_login };
