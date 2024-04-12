/************************************************************************
* Project: Software Programming Quiz
* Author: Li, Feng, Tauiliili
* Created: 2024-02-24
* Last Updated: 2024-02-24
* Purpose: Router for candidate creation endpoints
************************************************************************/

const express = require('express');
const router = express.Router();

const qz = require('../public/scripts/quiz_db_support');
const candidate_helper = require('../public/scripts/candidate_creation_support');
const userinfo = require('../public/scripts/user_info');
const email = require('../public/scripts/mail_send');
const require_login = require('../public/scripts/login-middleware').require_login;

router.get('/send-candidate-quiz', require_login, async (req, res) => {
    let context = { error: false};
    
    // Get available quizzes - make sure we pull latest up quiz versions 
    context = await qz.get_latest_quiz_version(req.session.username, context);

    if(context.error) {
        res.redirect('/errorhandler', context);
    }

    console.log(`context: ` + JSON.stringify(context));
    res.render('send-candidate-quiz', context);
});

router.post('/send-candidate-quiz', async (req, res) => {
    let context = { error: false };

    context = await candidate_helper.set_candidate_details(req.body, context);
    context = await userinfo.get_user_by_username(req.session.username, context);

    let accname = context?.account_details?.profile_name ? context?.account_details?.profile_name : req.session.username;
    
    let subject = `Software Programming Candidacy Assessment`;
    let text = `Hello ${req.body.nickname}, please navigate to http://localhost:65121/quiz/${context.quiz_key} to take \ 
        the candidacy assessment. This assessment must be completed by ${req.body.quiz_expiration}. Thank you.`;
    let html = `<p>Hello ${req.body.nickname},<br><br>Please <a href="http://localhost:65121/quiz/${context.quiz_key}">click this link</a> to take \
        the candidacy assessment. This assessment must be completed by ${req.body.quiz_expiration}. \
        <br><br>Thank you!<br><br>Sincerely,<br>${accname}</p>`;

    context = await email.candidate_email(req.body.candidate_email, subject, context.quiz_key, text, html, context);
    
    if(context.error) {
        res.redirect('/errorhandler', context);
    }
    // Get available quizzes - make sure we pull latest up quiz versions 
    // This is because the quizzes state is not retained
    context = await qz.get_latest_quiz_version(req.session.username, context);

    console.log(`context: ` + JSON.stringify(context));
    res.render('send-candidate-quiz', context);
});



module.exports = router;