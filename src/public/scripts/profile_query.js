/************************************************************************
Project: Software Programming Quiz
Purpose: Query profile info for given username
Author: Li, Feng, Tauiliili
Last Updated: 2024-03-05
************************************************************************/
var db_pool = require('./database');

async function profile_query(requ, resp) {
  
  let username = requ.session.username.toLowerCase();

  if (requ.session.loggedin != true) {
    username = requ.body.username.toLowerCase();
  };

  if (username) {

    // grab a connection from the pool
    var profile_connect = await db_pool.getConnection()
    .catch((error) => {
        console.log(error);
        resp.end();
    });

    // query profile data from username
    var profile = await profile_connect.query('SELECT user_name, password, profile_name, email, state, sec_question, sec_answer FROM Accounts as t1 JOIN Profiles as t2 ON t1.account_id = t2.account_id WHERE user_name = ?', [username])
    .catch((error) => {
        console.log(error);
        resp.end();
    });

    profile_connect.release();

    // if profile is found
    if(profile.length > 0) {
    const profile_data = [];
    profile_data[0]= profile[0].user_name;;
    profile_data[1]= profile[0].profile_name;
    profile_data[2]= profile[0].email;
    profile_data[3]= profile[0].state;
    profile_data[4]= profile[0].password;
    profile_data[5]= profile[0].sec_question;
    profile_data[6]= profile[0].sec_answer;
    return profile_data;

  } else {
    // if no account is found
    var string = encodeURIComponent('query');
    resp.redirect('/forgot_password_login?error=' + string);
  }	
} else {
  // no username 
  var string = encodeURIComponent('login');
  resp.redirect('/forgot_password_login?error=' + string);
};
resp.end();
};

module.exports = {profile_query};