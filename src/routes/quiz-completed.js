/************************************************************************
* Project: Software Programming Quiz
* Author: Li, Feng, Tauiliili
* Created: 2024-02-16
* Last Updated: 2024-02-23
* Purpose: Router for the completed quiz pages
************************************************************************/

const express = require('express');
const router = express.Router();

const qz = require('../public/scripts/quiz_db_support');
const email = require('../public/scripts/mail_send');

router.get('/quiz-completed', (req, res) => {
    let context = { completed_message : ""};
    res.render('quiz-completed', context);
});

router.post('/quiz-completed', async (req, res) => {
    let context = {error: false};
    console.log(req.body);
    let quiz_key = req.cookies.quiz_key;

    context = await qz.get_quiz_and_creator_name(quiz_key, context);

    let subject = `[${context.quiz_name}] Assessment has been Completed by ${req.cookies.candidate_nickname}`;
    let text = `The assessment for ${req.cookies.candidate_email} ${req.cookies.candidate_nickname} has been completed for quiz key ${quiz_key}`;
    let html = `<p>The assessment for <b>${req.cookies.candidate_email} ${req.cookies.candidate_nickname}</b> has been completed for quiz key ${quiz_key}. \
        Click link <a href="http://localhost:65121/display-quiz/${quiz_key}">here</a> to review test results.<br><br>Thank you!`;

    context = await qz.set_quiz_attempt_responses(quiz_key, req.body, context);
    if(context?.quiz_creator_email) {
        context = await email.notification_email(context.quiz_creator_email, subject, quiz_key, text, html, context);
    } else {
        context.error = true;
        context.errorMessage += `No email address associated with the quiz creator. Cannot send email. `;
        console.log(context.errorMessage);
    }

    context.completed_message = `This quiz has been successfully submitted.`
    if(context.error) {
        context.completed_message += ` Although please reach out to admin regarding an error that occurred. `;
        context.completed_message += context.errorMessage;
    }
    
    res.render('quiz-completed', context);
});

module.exports = router;