/************************************************************************
Project: Software Programming Quiz
Purpose: check if security question was answered correctly
Author: Li, Feng, Tauiliili
Last Updated: 2024-02-28
************************************************************************/
var db_pool = require('./database');

async function reset_pass(requ, resp) {
  
  let username = requ.body.acctuser;
  let newpass = requ.body.newpass;
  let answer = requ.body.acctans;

  if (username && answer) {

    // grab a connection from the pool
    var profile_connect = await db_pool.getConnection()
    .catch((error) => {
        console.log(error);
        resp.end();
    });

    // query security answer from username
    var profile = await profile_connect.query('SELECT user_name, sec_answer FROM Accounts as t1 JOIN Profiles as t2 ON t1.account_id = t2.account_id WHERE user_name = ?', [username])
    .catch((error) => {
        console.log(error);
        resp.end();
    });

    profile_connect.release();

    // if profile is found
    if(profile.length > 0 && newpass) {

        // answer is correct 
        if (profile[0].sec_answer == answer) {
          var pass_conn = await db_pool.getConnection();
          try {
              await pass_conn.beginTransaction();
              await pass_conn.query('UPDATE Accounts SET password = ? WHERE user_name = ?',[newpass, username]);
              await pass_conn.commit();
          } finally {
            pass_conn.release();
          };

          resp.redirect('/login');

        } else {
            //answer is wrong
            var string = encodeURIComponent('question');
            resp.redirect('/login?error=' + string);
        }

  } else {
    // if no account is found
    resp.redirect('/login');
  }	
} else {
  // no username 
  resp.redirect('/login');
};
resp.end();
};

module.exports = {reset_pass};