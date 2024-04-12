/************************************************************************
Project: Software Programming Quiz
Purpose: Login middleware
Author: Li, Feng, Tauiliili
Last Updated: 2024-03-09
************************************************************************/

// Purpose: Login middleware
async function require_login(req, res, next) {
    if (!req.session.loggedin) {
        // Store our URL we want to come back to
        req.session.previousurl = req.url;
        res.redirect('/login');
    } else {
        next();
    }
}

module.exports = { require_login };