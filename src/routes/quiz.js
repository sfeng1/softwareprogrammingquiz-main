/************************************************************************
* Project: Software Programming Quiz
* Author: Li, Feng, Tauiliili
* Created: 2024-02-16
* Last Updated: 2024-03-09
* Purpose: Router for the quiz taking pages
************************************************************************/

'use strict';

const express = require('express');
const router = express.Router();
const moment = require('moment');

const vc = require('../public/scripts/candidate_verification');
const qz = require('../public/scripts/quiz_db_support');

// Global Variables
const COOKIE_MAX_AGE = 86400000; // default cookie age is 24 hours

router.get('/quiz/:quiz_key', async (req, res) =>  {
    let context = 
    {error: false, candidate_nickname: ''};

    context = await qz.get_quiz_timelimit(req.params.quiz_key, req.cookies.candidate_email, context);
    context = await qz.verify_quiz_attempt_status(req.params.quiz_key, context);
    context = await qz.get_quiz_expiration_date(req.params.quiz_key, context);

    // If this quiz has already been taken, re-direct to 
    if (context?.attempt_submit_time && context?.attempt_start_time) {
        context.completed_message = `This quiz has previously been completed on ${context.attempt_submit_time}.`
        res.render('quiz-completed', context);
    } else if (moment(context?.quiz_expiration_date).format('YYYY-MM-DD HH:mm') <= moment(new Date()).format('YYYY-MM-DD HH:mm')){
        console.log(`context: ` + JSON.stringify(context));
        res.render('quiz-expired', context);
    } else {
        // Check if we have verified this candidate
        context.isverified = req.cookies?.candidate_verified ? req.cookies?.candidate_verified : false;

        // Has this quiz already started but not completed
        context.quizstarted = context?.attempt_start_time ? true : false;

        // check if we already have this candidate's info
        context.candidate_nickname = req.cookies?.candidate_nickname || context.candidate_nickname;

        console.log(`context: ` + JSON.stringify(context));
        res.render('quiz', context);
    }
});

router.post('/quiz/:quiz_key', async (req, res) => {
    let context = {error: false, isverified: false, quizstarted: false};

    // context.quizstarted = false;
    if (req.body['Start Quiz']) {
        context = await qz.get_quiz_timelimit(req.params.quiz_key, req.cookies.candidate_email, context);
        context = await qz.set_quiz_attempt(req.params.quiz_key, req.cookies.candidate_email, context);
        context.quizstarted = true;
        context.isverified = true;

        context.questions ;
    } else if (req.body['Verify Email']) {
        context = await vc.verify_candidate(req.params.quiz_key, req.body.candidate_email, context);
        if(context?.candidate && Object.keys(context?.candidate).length > 0){
            res.cookie('candidate_email', context.candidate.candidate_email, { maxAge: COOKIE_MAX_AGE });
            res.cookie('candidate_nickname', context.candidate.nickname, { maxAge: COOKIE_MAX_AGE });
            res.cookie('candidate_verified', true, { maxAge: COOKIE_MAX_AGE });
            res.cookie('quiz_key', req.params.quiz_key, { maxAge: COOKIE_MAX_AGE });
            context.candidate_nickname = context?.candidate.nickname;
        }
    }

    console.log(`context: ` + JSON.stringify(context));
    res.render('quiz', context);
});

module.exports = router;