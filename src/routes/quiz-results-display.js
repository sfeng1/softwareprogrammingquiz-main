/************************************************************************
* Project: Software Programming Quiz
* Author: Li, Feng, Tauiliili
* Created: 2024-02-17
* Last Updated: 2024-02-17
* Purpose: Router for display quiz results (completed or not)
************************************************************************/

const express = require('express');
const router = express.Router();

const qz = require('../public/scripts/quiz_db_support');
const require_login = require('../public/scripts/login-middleware').require_login;

router.get('/display-quiz/:quiz_key', require_login, async (req, res) => {
    let context = { error: false, qstn_response: '' };

    // Get the quiz attempt details
    context = await qz.verify_quiz_attempt_status(req.params.quiz_key, context);

    // If this quiz has not been started or there was an error retrieving attempt details
    if (context.error) {
        context.errorMessage += ` Please try again.`
    } else if (!context?.attempt_submit_time) {
        context.errorMessage = `This quiz has not been submitted.`
    } else {
        context = await qz.get_quiz_attempt_responses(context?.attempt_id, context);
        // console.log(`context.qstn_response: ` + JSON.stringify(context.qstn_response));
    }

    console.log(`context: ` + JSON.stringify(context));
    res.render('display-quiz', context);
});

router.get('/ranked-quiz-results/:quiz_id&:quiz_version_id', require_login, async (req, res) => {
    let context = { error: false };

    // Get the quiz attempt details
    context = await qz.get_candidate_attempt_results(req.params.quiz_id,
        req.params.quiz_version_id, context);
    // Get the quiz details
    context = await qz.get_quiz_details(req.params.quiz_id,
        req.params.quiz_version_id, context);

    // If there was an error
    if (context.error) {
        context.errorMessage += ` Please try again.`
    }

    console.log(`context: ` + JSON.stringify(context));
    res.render('ranked-quiz-results', context);
});

module.exports = router;