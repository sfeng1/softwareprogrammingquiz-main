/************************************************************************
Project: Software Programming Quiz
Purpose: Support for quiz db actions
Author: Li, Feng, Tauiliili
Created: 2024-02-09
Last Updated: 2024-03-09
************************************************************************/
const db = require('./database');
const moment = require('moment');

async function verify_quiz_attempt_status(quiz_key, ctxt) {
    // check the input fields are not empty
    if (quiz_key) {
        let conn, query;
        try {
            query = 'SELECT a.start_time, a.submit_time, a.attempt_id FROM Attempts a WHERE a.quiz_key=?';
            conn = await db.getConnection();

            let attempt_details = await conn.query(query, [quiz_key]);
            console.log(attempt_details);

            if (attempt_details.length == 1) {
                ctxt.attempt_start_time = attempt_details[0].start_time;
                ctxt.attempt_submit_time = attempt_details[0].submit_time;
                ctxt.attempt_id = attempt_details[0].attempt_id;
                ctxt.error = false;
            }
        } catch (err) {
            console.log(conn);
            throw err;
        }
        finally {
            if (conn) conn.end(err => {
                if (err) {
                    console.log("SQL error in closing connection: ", err);
                }
            });
        }
    }

    return ctxt;
};

async function get_quiz_details(quiz_id, quiz_version_id, ctxt) {
    // check the input fields are not empty
    if (quiz_id && quiz_version_id) {
        let conn, query;
        try {
            query = 'SELECT q.* FROM Quizzes q WHERE q.quiz_id=? AND q.quiz_version_id=?';
            conn = await db.getConnection();

            let q = await conn.query(query, [quiz_id, quiz_version_id]);
            console.log(q);

            if (q.length == 1) {
                ctxt.quiz_details = q[0];
                ctxt.error = false;
            } else {
                ctxt.error = true;
                ctxt.errorMessage = (q.length > 1) ? `Multiple quiz results for quiz_id=${quiz_id} and quiz_version_id=${quiz_version_id}` :
                    "There was an error retrieving the quiz details from the database."
                console.log(ctxt.errorMessage);
            }
        } catch (err) {
            console.log(conn);
            throw err;
        }
        finally {
            if (conn) conn.end(err => {
                if (err) {
                    console.log("SQL error in closing connection: ", err);
                }
            });
        }
    }

    return ctxt;
};

async function get_quiz_expiration_date(quiz_key, ctxt) {
    // check the input fields are not empty
    if (quiz_key) {
        let conn, query;
        try {
            query = 'SELECT quiz_expiration_date FROM Candidates WHERE quiz_key=?';
            conn = await db.getConnection();

            let c = await conn.query(query, [quiz_key]);
            console.log(c);

            if (c.length == 1) {
                ctxt.quiz_expiration_date = c[0].quiz_expiration_date;
                ctxt.error = false;
            } else {
                ctxt.error = true;
                ctxt.errorMessage = (q.length > 1) ? `Multiple quiz results for quiz_key=${quiz_key}` :
                    "There was an error retrieving the quiz details from the database."
                console.log(ctxt.errorMessage);
            }
        } catch (err) {
            console.log(conn);
            throw err;
        }
        finally {
            if (conn) conn.end(err => {
                if (err) {
                    console.log("SQL error in closing connection: ", err);
                }
            });
        }
    }

    return ctxt;
};

async function get_quiz_timelimit(quiz_key, candidate_email, ctxt) {
    // check the input fields are not empty
    if (quiz_key && candidate_email) {
        let conn, query;
        try {
            query = 'SELECT q.time_limit, att.start_time FROM Quizzes q LEFT JOIN Candidates c ON c.quiz_id=q.quiz_id \
                 AND c.quiz_version_id=q.quiz_version_id LEFT JOIN Attempts att ON att.quiz_key = c.quiz_key \
                 WHERE c.quiz_key=? AND UPPER(c.candidate_email)=?';
            conn = await db.getConnection();

            let t = await conn.query(query, [quiz_key, candidate_email.toUpperCase()]);

            console.log(t);

            if (t.length == 1) {
                let time = {};
                time.time_limit = t[0].time_limit;
                // In the event this test has already started but user refreshed page.
                time.attempt_start_time = t[0].start_time;
                ctxt.time = time;
            } else {
                ctxt.error = true;
                ctxt.errorMessage = (t.length > 1) ? "Multiple results found for this entry. Please contact admin to resolve."
                    : "There was an issue accessing the time limit for this assessment."
            }
        } catch (err) {
            console.log(conn);
            throw err;
        }
        finally {
            if (conn) conn.end(err => {
                if (err) {
                    console.log("SQL error in closing connection: ", err);
                }
            });
        }
    }

    return ctxt;
};

async function set_quiz_attempt(quiz_key, candidate_email, ctxt) {
    // check the input fields are not empty
    if (quiz_key && candidate_email) {
        let conn, query;
        try {
            // Check that this quiz_key and user does not already have an existing atttempt
            query = `SELECT att.* FROM Attempts att LEFT JOIN Candidates c ON att.quiz_key=c.quiz_key \
            AND att.quiz_id=c.quiz_id AND att.quiz_version_id=c.quiz_version_id WHERE att.quiz_key=? AND UPPER(c.candidate_email)=?`
            conn = await db.getConnection();
            let attempts = await conn.query(query, [quiz_key, candidate_email.toUpperCase()]);
            conn.close();

            // We already have an attempt
            if(attempts.length > 0) {
                console.log(`Did not add new attempt since an attempt exists.`)
            } else {
                query = 'SELECT q.quiz_id, q.quiz_version_id FROM Quizzes q LEFT JOIN Candidates c ON c.quiz_id=q.quiz_id \
                    AND c.quiz_version_id=q.quiz_version_id WHERE c.quiz_key=? AND c.candidate_email=?';

                let q = await conn.query(query, [quiz_key, candidate_email]);
                console.log(q);

                if (q.length == 1) {
                    let start_time = moment().format('YYYY-MM-DD HH:mm:ss');
                    query = 'INSERT INTO Attempts (quiz_id, quiz_version_id, quiz_key, start_time) VALUES (?, ?, ?, ?)';
                    await conn.beginTransaction();
                    await conn.query(query, [q[0].quiz_id, q[0].quiz_version_id, quiz_key, start_time]);
                    await conn.commit();
                    ctxt.attempt_start_time = start_time;
                    ctxt.time.attempt_start_time = start_time;
                    ctxt.error = false;
                } else {
                    ctxt.error = true;
                    ctxt.errorMessage = "There was an error retrieving the information necessary to insert the assessment attempt into the database."
                    console.log(ctxt.errorMessage);
                }
            }
        } catch (err) {
            console.log(conn);
            throw err;
        }
        finally {
            if (conn) conn.end(err => {
                if (err) {
                    console.log("SQL error in closing connection: ", err);
                }
            });
        }
    }

    return ctxt;
};

async function get_quiz_questions(quiz_key, ctxt) {
    // check the input fields are not empty
    if (quiz_key) {
        let conn, query;
        try {
            query = 'SELECT qst.* FROM Questions qst LEFT JOIN Candidates c ON c.quiz_id=qst.quiz_id \
            AND c.quiz_version_id=qst.quiz_version_id WHERE c.quiz_key=? ORDER BY qst.question_number asc';
            conn = await db.getConnection();

            let q = await conn.query(query, [quiz_key]);
            console.log(q);

            if (q?.length > 0) {
                ctxt.error = false;
                ctxt.quiz_questions = q;
                console.log("Successfully retrieve quiz questions.");
            } else {
                ctxt.error = true;
                ctxt.errorMessage = "There was an issue retrieving the questions for this quiz."
                console.log(ctxt.errorMessage);
            }
        } catch (err) {
            console.log(conn);
            throw err;
        }
        finally {
            if (conn) conn.end(err => {
                if (err) {
                    console.log("SQL error in closing connection: ", err);
                }
            });
        }
    }

    return ctxt;
};

async function set_quiz_attempt_responses(quiz_key, ans, ctxt) {
    if (quiz_key && ans) {
        let conn, query;
        try {
            // Retrieve existing attempt for this quiz_key
            query = 'SELECT a.* FROM Attempts a WHERE a.quiz_key=?';
            conn = await db.getConnection();

            let a = await conn.query(query, [quiz_key]);
            console.log(a);

            if (a.length == 1) {
                // Set attempt submit time
                let submit_time = moment().format('YYYY-MM-DD HH:mm:ss');

                ctxt.quiz_attempt = a[0];

                //  Set quiz response
                ctxt = await get_quiz_questions(quiz_key, ctxt);
                ctxt = await set_quiz_response_helper(a[0].attempt_id, ans, ctxt);

                // Update attempts details
                query = 'UPDATE Attempts set submit_time=?, total_score=? WHERE quiz_key=?';
                await conn.beginTransaction();
                await conn.query(query, [submit_time, ctxt.total_score, quiz_key]);
                await conn.commit();
                ctxt.error = false;
            } else {
                ctxt.error = true;
                ctxt.errorMessage = "There was an error retrieving the information necessary to update the assessment attempt into the database."
                console.log(ctxt.errorMessage);
            }
        } catch (err) {
            console.log(conn);
            throw err;
        }
        finally {
            if (conn) conn.end(err => {
                if (err) {
                    console.log("SQL error in closing connection: ", err);
                }
            });
        }
    }

    return ctxt;
};

async function set_quiz_response_helper(attempt_id, usr_ans, ctxt) {
    if (attempt_id && usr_ans) {
        let conn,
            query = 'INSERT INTO Responses (attempt_id, question_number, answer_text, points_earned)  VALUES (?, ?, ?, ?)',
            total_score = 0;
        let qstns = ctxt.quiz_questions;
        // Answer with single choice [{Choice: "Ans"}]
        // Answer with multi selection [{Choice: "Ans"}, {Choice: "Ans"}]
        // Freeform text 
        try {
            let fullresparr = [];
            for (const q in usr_ans) {
                // get the qnumber
                let qnum = parseInt(q.replace('q', ''));
                let qidx = qnum - 1, qpoints = 0;
                let respArr = [];
                if (qstns[qidx].question_number == qnum) {
                    if (qstns[qidx].question_type == 'FR') {
                        respArr.push({ AnswerText: usr_ans[q], Points: 0 });
                    } else if (["TF", "MC"].includes(qstns[qidx].question_type)) {
                        let ansArr = JSON.parse(qstns[qidx].correct_answer);
                        for (let i = 0; i < ansArr.length; i++) {
                            if (ansArr[i].Choice === usr_ans[q]) {
                                respArr.push({ Selected: usr_ans[q], Points: ansArr[i].Points });
                                qpoints += ansArr[i].Points;
                                break;
                            }
                        }
                    }
                    else {
                        //  Select all logic
                        let ansArr = JSON.parse(qstns[qidx].correct_answer);
                        if(typeof usr_ans[q] == "string") {
                            for (let i = 0; i < ansArr.length; i++) {
                                if (ansArr[i].Choice === usr_ans[q]) {
                                    respArr.push({ Selected: usr_ans[q], Points: ansArr[i].Points });
                                    qpoints += ansArr[i].Points;
                                    break;
                                }
                            }
                        } else {
                            for (let k = 0; k < usr_ans[q].length; k++) {
                                for (let i = 0; i < ansArr.length; i++) {
                                    if (ansArr[i].Choice === usr_ans[q][k]) {
                                        respArr.push({ Selected: usr_ans[q][k], Points: ansArr[i].Points });
                                        qpoints += ansArr[i].Points;
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }

                let s = JSON.stringify(respArr);
                console.log(s);
                fullresparr.push([attempt_id, qnum, s, qpoints]);

                // track score earned
                total_score += qpoints;
            }

            ctxt.total_score = total_score;

            conn = await db.getConnection();
            await conn.batch(query, fullresparr);
            await conn.commit();

            ctxt.error = false;
        } catch (err) {
            console.log(conn);
            ctxt.error = true;
            ctxt.errorMessage = "Issue saving quiz responses to the Database";
            throw err;
        }
        finally {
            if (conn) conn.end(err => {
                if (err) {
                    console.log("SQL error in closing connection: ", err);
                }
            });
        }
    }

    return ctxt;
};

async function get_quiz_attempt_responses(attempt_id, ctxt) {
    // check the input fields are not empty
    if (attempt_id) {
        let conn, query;
        try {
            query = 'SELECT a.*, c.candidate_email, c.nickname, q.total_points as max_score FROM Attempts a LEFT JOIN Candidates c ON  a.quiz_key = c.quiz_key  \
                       AND a.quiz_id = c.quiz_id AND a.quiz_version_id = c.quiz_version_id \
                       LEFT JOIN Quizzes q ON a.quiz_id = q.quiz_id AND a.quiz_version_id = q.quiz_version_id WHERE attempt_id=?';
            conn = await db.getConnection();
            let attempt_details = await conn.query(query, [attempt_id]);
            console.log(attempt_details);

            if (attempt_details.length == 1) {
                ctxt.attempt_total_score = attempt_details[0].total_score;
                ctxt.quiz_max_score = attempt_details[0].max_score;
                ctxt.candidate_email = attempt_details[0].candidate_email;
                ctxt.candidate_nickname = attempt_details[0].nickname;

                // Retrieve the questions and the correct answers and the user answers
                query = 'SELECT qstn.question_number, qstn.question_type, qstn.question_text, qstn.correct_answer, qstn.max_points,  \
                    r.answer_text,r.points_earned FROM Attempts a LEFT JOIN  Questions qstn ON qstn.quiz_id=a.quiz_id AND \
                        qstn.quiz_version_id=a.quiz_version_id LEFT JOIN Responses r ON r.attempt_id=a.attempt_id \
                        AND qstn.question_number=r.question_number WHERE a.attempt_id= ?';
                let qstn_responses = await conn.query(query, [attempt_id]);
                console.log(qstn_responses);

                if (qstn_responses.length > 0) {
                    ctxt.qstn_response = qstn_responses;
                    ctxt.error = false;
                } else {
                    ctxt.error = true;
                    ctxt.errorMessage = "No questions and/or responses found for this attempt.";
                }
            } else {
                ctxt.error = true;
                ctxt.errorMessage = (attempt_details.length > 1) ? "Multiple quiz attempts found." : "No quiz attempts found.";
            }
        } catch (err) {
            console.log(conn);
            throw err;
        }
        finally {
            if (conn) conn.end(err => {
                if (err) {
                    console.log("SQL error in closing connection: ", err);
                }
            });
        }
    }

    return ctxt;
};

async function get_candidate_attempt_results(quiz_id, quiz_version_id, ctxt) {
    // check the input fields are not empty
    if (quiz_id && quiz_version_id) {
        let conn, query;
        try {
            conn = await db.getConnection();
            
            query = `SELECT c.candidate_email, c.nickname, c.quiz_key, c.quiz_expiration_date, \
                CASE WHEN a.submit_time IS NULL THEN '-' ELSE a.submit_time END AS submit_time, \
                CASE WHEN a.total_score IS NULL THEN '-' ELSE a.total_score END AS total_score\
                FROM Candidates c LEFT JOIN Attempts a ON c.quiz_key=a.quiz_key \ 
                WHERE c.quiz_id=? AND c.quiz_version_id=? order by a.total_score desc`;
            let candidate_attempts = await conn.query(query, [quiz_id, quiz_version_id]);
            
            console.log(candidate_attempts);

            if (candidate_attempts.length > 0) {
                ctxt.candidate_attempts = candidate_attempts;
            } else {
                ctxt.error = true;
                ctxt.errorMessage = `No results found for quiz_id=${quiz_id}`
                if (quiz_version_id) ctxt.errorMessage += ` and quiz_version_id=${quiz_version_id}`;
            }
        } catch (err) {
            console.log(conn);
            throw err;
        }
        finally {
            if (conn) conn.end(err => {
                if (err) {
                    console.log("SQL error in closing connection: ", err);
                }
            });
        }
    }

    return ctxt;
};

async function get_quiz_and_creator_name(quiz_key, ctxt) {
    // check the input fields are not empty
    if (quiz_key) {
        let conn, query;
        try {
            query = 'SELECT acc.user_name, q.name as quiz_name, p.profile_name, p.email FROM Accounts acc LEFT JOIN Profiles p \
                ON acc.account_id=p.account_id LEFT JOIN Quizzes q \
                ON acc.account_id = q.account_id LEFT JOIN Candidates c ON c.quiz_id=q.quiz_id \
                AND c.quiz_version_id=q.quiz_version_id WHERE c.quiz_key=?';
            conn = await db.getConnection();

            let q = await conn.query(query, [quiz_key]);
            console.log(q);

            if (q.length == 1) {
                ctxt.quiz_creator_email = q[0].email;
                ctxt.quiz_name = q[0].quiz_name;
                ctxt.error = false;
            } else {
                ctxt.error = true;
                ctxt.errorMessage += (q.length > 1) ? `Multiple quiz_creator_email results for quiz_key=${quiz_key}` :
                    "There was an error retrieving the quiz creator email address from the database."
                console.log(ctxt.errorMessage);
            }
        } catch (err) {
            console.log(conn);
            throw err;
        }
        finally {
            if (conn) conn.end(err => {
                if (err) {
                    console.log("SQL error in closing connection: ", err);
                }
            });
        }
    }

    return ctxt;
};

async function get_latest_quiz_version(username, ctxt) {
    let conn, query;
    if(username) {
        try {
            query = `SELECT q.quiz_id, MAX(q.quiz_version_id) AS quiz_version_id, q.name  FROM Quizzes q \
                LEFT JOIN Accounts a ON a.account_id=q.account_id WHERE UPPER(a.user_name)=? GROUP BY quiz_id ORDER BY name asc`;
            conn = await db.getConnection();
            console.log(`username: ${username}`);
            let q = await conn.query(query, [username.toUpperCase()]);
            console.log(q);
    
            if (q.length > 0) {
                ctxt.quizzes = q;
                ctxt.error = false;
            } else {
                ctxt.error = true;
                ctxt.errorMessage += ` Problem  pulling back latest active quizzes.`
                console.log(ctxt.errorMessage);
            }
        } catch (err) {
            console.log(conn);
            throw err;
        }
        finally {
            if (conn) conn.end(err => {
                if (err) {
                    console.log("SQL error in closing connection: ", err);
                }
            });
        }
    
    }
    return ctxt;
};

module.exports = {
    get_candidate_attempt_results,
    get_latest_quiz_version,
    get_quiz_and_creator_name,
    get_quiz_details,
    get_quiz_timelimit,
    get_quiz_questions,
    get_quiz_attempt_responses,
    set_quiz_attempt,
    set_quiz_attempt_responses,
    get_quiz_expiration_date,
    set_quiz_response_helper,
    verify_quiz_attempt_status
};